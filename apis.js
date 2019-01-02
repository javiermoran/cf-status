const basePath = 'http://mxcfdi.corpfolder.com';
const core = { url: `${basePath}/api/latest/version`, name: 'Core prod', id: 'core' };
const fak = { url: `${basePath}/api/facturacion/latest/version`, name: 'Facturacion prod', id: 'fak' };
const babagge = { url: `${basePath}/api//babbage/latest/status`, name: 'Babagge prod', id: 'babagge' };
const vor = { url: `${basePath}/api/vor/router/latest/version`, name: 'Vor prod', id: 'vor' };

const stgBasePath = 'http://stagingmxcfdi.corpfolder.com';
const coreStg = { url: `${stgBasePath}/api/latest/version`, name: 'Core staging', id: 'coreStg' };
const fakStg = { url: `${stgBasePath}/api/facturacion/latest/version`, name: 'Facturacion staging', id: 'fakStg' };
const babaggeStg = { url: `${stgBasePath}/api//babbage/latest/status`, name: 'Babagge staging', id: 'babaggeStg' };
const vorStg = { url: `${stgBasePath}/api/vor/router/latest/version`, name: 'Vor staging', id: 'vorStg' };

const devBasePath = 'http://devmxcfdi.corpfolder.com';
const coreDev = { url: `${devBasePath}/api/latest/version`, name: 'Core dev', id: 'coreDev' };
const fakDev = { url: `${devBasePath}/api/facturacion/latest/version`, name: 'Facturacion dev', id: 'fakDev' };
const babaggeDev = { url: `${devBasePath}/api//babbage/latest/status`, name: 'Babagge dev', id: 'babaggeDev' };
const vorDev = { url: `${devBasePath}/api/vor/router/latest/version`, name: 'Vor dev', id: 'vorDev' };

export default [ 
  core, fak, vor, babagge, 
  coreStg, fakStg, babaggeStg, vorStg,
  coreDev, fakDev, babaggeDev, vorDev
];