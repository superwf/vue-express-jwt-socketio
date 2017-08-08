import {
  Source,
  parse,
  validate,
  execute,
  specifiedRules,
} from 'graphql'
import { ERROR } from '../../client/store/types'

export default function graphqlParser (options) {
  if (!options) {
    throw new Error('parse GraphQL requires options.')
  }

  return (data) => {
    if (!data || !data.query) {
      return Promise.reject(new Error('data must be object, and has query property'))
    }
    let documentAST
    let operationName

    // Promises are used as a mechanism for capturing any thrown errors during
    // the asynchronous process below.

    // Parse the Request to get GraphQL request parameters.
    // Collect information from the options data object.
    const schema = options.schema
    const context = options.context
    const rootValue = options.rootValue

    let validationRules = specifiedRules
    if (options.validationRules) {
      validationRules = validationRules.concat(options.validationRules)
    }

    // Get GraphQL params from the request and POST body data.
    operationName = data.operationName

    // GraphQL source.
    const source = new Source(data.query, 'GraphQL request')

    // Parse source to AST, reporting any syntax error.
    try {
      documentAST = parse(source)
      operationName = operationName || documentAST.definitions[0].name.value
    } catch (syntaxError) {
      return Promise.reject(syntaxError)
    }

    // Validate AST, reporting any errors.
    const validationErrors = validate(schema, documentAST, validationRules)
    if (validationErrors.length > 0) {
      return Promise.reject(validationErrors)
    }
    // Perform the execution, reporting any errors creating the context.
    try {
      return execute(
        schema,
        documentAST,
        rootValue,
        context,
        data.variables,
        operationName,
      ).then(result => {
        debugger
        if (result.errors) {
          return {
            type: ERROR,
            errors: result.errors
          }
        }
        const r = {
          type: data.type,
          // only support single query at one time
          data: Object.values(result.data)[0]
        }
        if (data.room) {
          r.room = data.room
        }
        return r
      })
    } catch (contextError) {
      return Promise.reject(contextError)
    }
  }
}
