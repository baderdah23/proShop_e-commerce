import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import apiError from "./apiError.js";

type QueryResult<T = any> = {
  rows: T[];
  rowCount: number | null;
};

export const deleteHandler = <T = any>(
  deleteQueryFn: (id: string) => Promise<QueryResult<T> | null | any>,
  modelName: string,
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      const error = new apiError(`${modelName} not found`, 404);
      next(error);
      return;
    }

    const queryResult = await deleteQueryFn(id as string);

    if (!queryResult || !queryResult.rows || queryResult.rows.length === 0) {
      const err = new apiError(`${modelName} not found`, 404);
      next(err);
      return;
    }

    const responseKey = modelName.toLowerCase();
    res.status(200).json({
      success: true,
      results: queryResult.rowCount,
      [responseKey]: queryResult.rows[0],
    });
  });

export const getByIdHandler = <T = any>(
  getQueryFn: (id: string) => Promise<QueryResult<T> | T[] | null | any>,
  modelName: string,
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      const error = new apiError(`${modelName} not found`, 404);
      next(error);
      return;
    }

    const queryResult = await getQueryFn(id as string);

    if (!queryResult) {
      const error = new apiError(`${modelName} not found`, 404);
      next(error);
      return;
    }

    if (Array.isArray(queryResult)) {
      if (queryResult.length === 0) {
        const error = new apiError(`${modelName} not found`, 404);
        next(error);
        return;
      }
      const responseKey = modelName.toLowerCase();
      res.status(200).json({
        success: true,
        [responseKey]: queryResult,
      });
      return;
    }

    if (!queryResult.rows || queryResult.rows.length === 0) {
      const err = new apiError(`${modelName} not found`, 404);
      next(err);
      return;
    }

    const responseKey = modelName.toLowerCase();
    res.status(200).json({
      success: true,
      results: queryResult.rowCount,
      [responseKey]: queryResult.rows[0],
    });
  });

export const updateHandler = <T = any>(
  updateQueryRunner: (req: Request) => Promise<QueryResult<T> | null | any>,
  modelName: string,
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      const error = new apiError(`${modelName} not found`, 404);
      next(error);
      return;
    }

    const queryResult = await updateQueryRunner(req);

    if (!queryResult || !queryResult.rows || queryResult.rows.length === 0) {
      const err = new apiError(`${modelName} not found`, 404);
      next(err);
      return;
    }

    const responseKey = modelName.toLowerCase();
    res.status(200).json({
      success: true,
      results: queryResult.rowCount,
      [responseKey]: queryResult.rows[0],
    });
  });

export const createHandler = <T = any>(
  createQueryRunner: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<QueryResult<T> | null | any>,
  modelName: string,
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const queryResult = await createQueryRunner(req, res, next);

    if (!queryResult || !queryResult.rows || queryResult.rows.length === 0) {
      const err = new apiError(
        `Failed to create ${modelName.toLowerCase()}`,
        400,
      );
      next(err);
      return;
    }

    const responseKey = modelName.toLowerCase();
    res.status(201).json({
      success: true,
      results: queryResult.rowCount,
      [responseKey]: queryResult.rows[0],
    });
  });

export const getAllHandler = <T = any>(
  getAllQueryRunner: (
    req: Request,
  ) => Promise<QueryResult<T> | T[] | null | any>,
  modelName: string,
  pluralKeyName?: string,
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const queryResult = await getAllQueryRunner(req);

    const responseKey = pluralKeyName || `${modelName.toLowerCase()}s`;

    if (!queryResult) {
      const error = new apiError(`No ${modelName.toLowerCase()}s found`, 404);
      next(error);
      return;
    }

    if (Array.isArray(queryResult)) {
      if (queryResult.length === 0) {
        const error = new apiError(`No ${modelName.toLowerCase()}s found`, 404);
        next(error);
        return;
      }
      res.status(200).json({
        success: true,
        results: queryResult.length,
        [responseKey]: queryResult,
      });
      return;
    }

    const rows = queryResult.rows || [];
    if (rows.length === 0 || queryResult.rowCount === 0) {
      const err = new apiError(`No ${modelName.toLowerCase()}s found`, 404);
      next(err);
      return;
    }

    const totalCount = rows[0]?.total_count;
    const responsePayload: any = {
      success: true,
      results: queryResult.rowCount ?? rows.length,
    };

    if (totalCount !== undefined) {
      responsePayload.total = Number(totalCount);
    }

    if (req.query.page) {
      responsePayload.page = Number(req.query.page);
    }

    responsePayload[responseKey] = rows.map((row: any) => {
      if (row.total_count === undefined) {
        return row;
      }

      const { total_count: _totalCount, ...item } = row;
      return item;
    });

    res.status(200).json(responsePayload);
  });

export const deleteOne = deleteHandler;
export const getOne = getByIdHandler;
export const updateOne = updateHandler;
export const createOne = createHandler;
export const getAll = getAllHandler;
