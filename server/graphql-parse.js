import {
  Source,
  parse,
  validate,
  execute,
  specifiedRules,
} from 'graphql'

export default function graphqlParser (options) {
  if (!options) {
    throw new Error('parse GraphQL requires options.')
  }

  return (data) => {
    // if (!data || data.query) {
    //   return Promise.reject(new Error('data should be object and has query property'))
    // }
    let query

    let documentAST
    let variables
    let operationName

    // Promises are used as a mechanism for capturing any thrown errors during
    // the asynchronous process below.

    // Parse the Request to get GraphQL request parameters.
    return Promise.resolve(data)
      .then(data => {
        // Collect information from the options data object.
        const schema = options.schema
        const context = options.context
        const rootValue = options.rootValue

        let validationRules = specifiedRules
        if (options.validationRules) {
          validationRules = validationRules.concat(options.validationRules)
        }

        // Get GraphQL params from the request and POST body data.
        query = data.query
        variables = data.variables
        operationName = data.operationName

        // GraphQL source.
        const source = new Source(query, 'GraphQL request')

        // Parse source to AST, reporting any syntax error.
        try {
          documentAST = parse(source)
          operationName = documentAST.definitions[0].name.value
        } catch (syntaxError) {
          return { errors: [syntaxError] }
        }

        // Validate AST, reporting any errors.
        const validationErrors = validate(schema, documentAST, validationRules)
        if (validationErrors.length > 0) {
          return { errors: validationErrors }
        }
        // Perform the execution, reporting any errors creating the context.
        try {
          return execute(
            schema,
            documentAST,
            rootValue,
            context,
            variables,
            operationName,
          ).then(result => {
            return {
              type: data.type,
              data: Object.values(result.data)[0]
            }
          })
        } catch (contextError) {
          return { errors: [contextError] }
        }
      })
      .catch(error => {
        return { errors: [error] }
      })
  }
}
