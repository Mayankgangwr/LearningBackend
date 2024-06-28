import { Request, Response, NextFunction, RequestHandler } from 'express';

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};

export default asyncHandler;

/*
    const asyncHandler  = () => {}
    const asyncHandler = (func) => () => {}
    const asyncHandler = (func) => async () => {}
    

const asyncHandler = (fun: RequestHandler) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await fun(req, res, next);
    } catch (err: any) {
        res.send(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}
  
*/
