import {Header, JsonProperty, StatusCode} from '../meta-data/response-meta';

export class BadRequestResponse {
    constructor(error: string | Error, details: any) {
        if (error instanceof Error) {
            this.message = error.message;
        } else {
            this.message = error;
        }
        
        this.rawResponse = details;
    }

    @StatusCode(400)
    statusCode: number;
    @JsonProperty()
    message: string;
    @JsonProperty() 
    rawResponse: any
}

export class CreatedResponse {
    @StatusCode(201)
    statusCode: number;
}

export class SuccessResponse {
    @StatusCode(200)
    statusCode: number;
}

export class NotFoundResponse {
    @StatusCode(404)
    statusCode: number;

    @JsonProperty()
    error: string = "Not found"
}

export class ConflictResponse {
    @StatusCode(409)
    statusCode: number;
    
    @JsonProperty()
    error: string = "Duplicate record"
}

export class RedirectResponse {
    constructor(url: string) {
        this.url = url
    }
    @Header('Location')
    url: string;

    @StatusCode(302, true)
    statusCode: number;
}