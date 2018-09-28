#!/usr/bin/env node

import chalk from 'chalk'
import execa from 'execa'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import L from 'lodash'
import ora from 'ora'
import path from 'path'
import URL from 'url'
import parser from 'yargs-parser'

const help = `Please specify a package to add.

$ hygen-add PACKAGE [--name NAME] [--prefix PREFIX] 

  PACKAGE: npm module or Git repository
           - note: for an npm module named 'hygen-react', PACKAGE is 'react'
   --name: package name for a Git repo when cannot infer from repo URL (optional)
 --prefix: prefix added generators, avoids clashing names (optional)
`

const tmpl = x => path.join('_templates', x)

const resolvePackage = (pkg, opts) => {
  if (pkg.match(/^http/)) {
    if (opts.name) {
      return { name: opts.name, isUrl: true }
    }
    return { name: L.last(URL.parse(pkg).path.split('/')), isUrl: true }
  }
  return { name: `hygen-${pkg}`, isUrl: false }
}

const main = async () => {
  const { red, green, yellow } = chalk
  const args = parser(process.argv.slice(2))
  const [pkg] = args._
  if (!pkg) {
    console.log(help)
    process.exit(1)
  }
  const { name, isUrl } = resolvePackage(pkg, args)
  const spinner = ora(`Adding: ${name}`).start()

  try {
    await execa.shell(
      `${path.join(__dirname, '../node_modules/.bin/')}yarn add --dev ${
        isUrl ? pkg : name
      }`
    )
    const templatePath = path.join('./node_modules', name, '_templates')
    const exists = await fs.pathExists(templatePath)
    await fs.mkdirp('_templates')

    spinner.stop()
    for (const g of await fs.readdir(templatePath)) {
      const maybePrefixed = args.prefix ? `${args.prefix}-${g}` : g
      const wantedTargetPath = tmpl(maybePrefixed)
      const sourcePath = path.join(templatePath, g)

      if (await fs.pathExists(wantedTargetPath)) {
        if (
          !(await inquirer
            .prompt([
              {
                message: `'${maybePrefixed}' already exists. Overwrite? (Y/n): `,
                name: 'overwrite',
                prefix: '      🤔 :',
                type: 'confirm'
              }
            ])
            .then(({ overwrite }) => overwrite))
        ) {
          console.log(yellow(` skipped: ${maybePrefixed}`))
          continue
        }
      }

      await fs.copy(sourcePath, wantedTargetPath, {
        recursive: true
      })
      console.log(green(`   added: ${maybePrefixed}`))
    }
  } catch (ex) {
    console.log(
      red(`\n\nCan't add ${name}${isUrl ? ` (source: ${pkg})` : ''}\n\n`),
      ex
    )
  }
}

main()
