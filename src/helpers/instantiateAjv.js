// import all schemas for ajv
import emergencyContact from '../schemas/emergency-contact-schema.json';
import emergencyContacts from '../schemas/emergency-contacts-schema.json';
import essay from '../schemas/essay.json';
const Ajv = require('ajv');

export default function instantiateAjv() {
  
  const ajv = new Ajv({
    schemas: [
      emergencyContact,
      emergencyContacts,
      essay
    ],
    allErrors: true,
    jsonPointers: true,
  });
  require('ajv-errors')(ajv);

  ajv.addKeyword('isNotEmpty', {
    type: 'string',
    validate: function (schema, data) {
      return typeof data === 'string' && data.trim() !== ''
    },
    errors: false
  })

  return ajv;

}