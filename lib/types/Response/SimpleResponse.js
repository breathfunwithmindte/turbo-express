const { ResponseInterface } = require("../SystemTypes");
const { HEADERS, CONTENT_TYPE, PERFECT_EVOLUTION } = require('../Headers')

module.exports = class SimpleResponse extends ResponseInterface {
    defaultHeaders() 
    {
        this.setHeader(HEADERS.PERFECT_EVOLUTION, PERFECT_EVOLUTION.TURBO_EXPRESS)
    }

    /**
     * 
     * @param {string} content - Content that will be sent to the client 
     * @description - This method sends plain text as a response. Automatically sets header to text/plain if no header is set
     */
    send(content) 
    {
        this.setHeader(HEADERS.CONTENT_TYPE, CONTENT_TYPE.TEXT_PLAIN)
        this.defaultHeaders()
        this.complete(content)
    }

    /**
     * 
     * @param {string} url - Some url to redirect client to. 
     * @description - This method will redirect client to url. It sets redirect header automatically.
     */
    redirect(url) 
    {
        if(this.statusCode < 300 || this.statusCode >= 400) {
            this.statusCode = 302
        }

        this.setHeader(HEADERS.LOCATION, url)
        this.defaultHeaders()
        this.complete()
    }

    /**
     * 
     * @param {string} content - Content that will be sent to the client 
     * @description - This method sends json string as a response.
     */
    json(content) 
    {
        this.setHeader(HEADERS.CONTENT_TYPE, CONTENT_TYPE.APPLICATION_JSON)
        this.defaultHeaders()
        this.complete(JSON.stringify(content))
    }
}