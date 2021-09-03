const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./controllers']

swaggerAutogen(outputFile, endpointsFiles)