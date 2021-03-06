#!/usr/bin/env node
"use strict";

/**
 *
 * Interface to the JSON Schema processor package "ajv". It is used to check the configuration file as well as the nicknames' file.
 *
 * The schemas themselves are part of the distribution as JSON files.
 *
 */


const fs  = require('fs');

let get_schema = (fname) => {
    try {
        let filename = `${__dirname}/../${fname}`;
        let file_c = fs.readFileSync(filename, "utf-8");
        return JSON.parse(file_c);
    } catch(e) {
        console.log(`Scribejs no such configuration file: ${fname}`);
        // process.exit();
        return {};
    }
}

let config_schema    = get_schema("schemas/config_schema.json");
let nicknames_schema = get_schema("schemas/nicknames_schema.json");


/*
* The real interface... creation of a new Ajv object, and then the creation of the two separate "validators" for the two schemas.
* 
*/
const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});
// I am not sure why this is necessary and not done automatically. Oh well...
ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

/**
* The two validator objects/functions
*
*/
exports.validate_config = ajv.compile(config_schema);
exports.validate_nicknames = ajv.compile(nicknames_schema);

/**
 * This is the ajv idiom for producing a human readable set of error messages...
 * The Ajv object is initialized with the option of gathering all errors in one message, so the expected output is a series of errors.
 *
 * @param {object} validator - an ajv validator object (result of compilation)
 * @return {string} - string version of the errors, separated by new line characters.
 *
 */
exports.validation_errors = (validator) => {
    return ajv.errorsText(validator.errors, {separator: "\n"});
};

