const { exec } = require('child_process')
const fs = require('fs')

const PACKAGE_PATH = './package.json'

const getPackageJSON = () => require(PACKAGE_PATH)
// We don't want that initial `v` in vX.X.X but just X.X.X

const getNodeVersion = () => process.version.replace('v', '')

const getNPMVersion = () =>
  new Promise((resolve, reject) => {
    exec('npm -v', (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr })
      }
      // Let's get rid of the final `\n`.
      const version = stdout.split('\n')[0]
      resolve(version)
    })
  })

const getVersions = async () => {
  // TODO: error handling
  const npm = await getNPMVersion()
  const node = await getNodeVersion()

  return {
    node,
    npm,
  }
}

const getEngines = async () => {
  const engines = await getVersions()
  const extendedProperties = { engines }
  return extendedProperties
}

const savePackage = updatedPackage =>
  fs.writeFile(
    PACKAGE_PATH,
    JSON.stringify(updatedPackage, null, 2),
    // TODO: maybe log the errors?
    // console.log,
    () => {},
  )

async function extendPackage() {
  const package = getPackageJSON()
  const engines = await getEngines()
  const extendedPackage = { ...package, ...engines }

  console.log(extendedPackage)
  savePackage(extendedPackage)
}

extendPackage()
