import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationMetaDto } from '../../common/dto/pagination/pagination-meta.dto';

export const ApiPaginatedResponse = <TModel extends Type>(
  model: TModel,
  // eslint-disable-next-line @typescript-eslint/ban-types
): (<TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void) => {
  return applyDecorators(
    ApiExtraModels(PaginationMetaDto),
    ApiOkResponse({
      description: 'Successfully received model list',
      schema: {
        allOf: [
          { properties: { meta: { $ref: getSchemaPath(PaginationMetaDto) } } },
          {
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
