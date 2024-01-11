import { celebrate, Joi, Segments } from 'celebrate';
import { isCropType } from '@configs/farm';
import { cnpj } from '@shared/utils/cnpj';
import { cpf } from '@shared/utils/cpf';

export const createFarmValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    document: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (cpf.isValid(value)) {
          return value;
        }
        if (cnpj.isValid(value)) {
          return value;
        }

        return helpers.error('document.invalid');
      })
      .label('farm document'),
    farm: Joi.object().keys({
      farm_name: Joi.string().required(),
      total_area: Joi.number().required(),
      total_agricultural_area: Joi.number().required(),
      total_vegetation_area: Joi.number().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      crops: Joi.array()
        .items(Joi.string())
        .required()
        .custom((value, helpers) => {
          let errors = 0;
          value.forEach((crop: any) => {
            if (!isCropType(crop)) {
              errors++;
            }
          });

          if (errors > 0) return helpers.error('cropType.invalid');

          return value;
        })
        .label('cropType'),
    }),
  }),
});

export const updateFarmValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string(),
    document: Joi.string()
      .custom((value, helpers) => {
        if (cpf.isValid(value)) {
          return value;
        }
        if (cnpj.isValid(value)) {
          return value;
        }

        return helpers.error('document.invalid');
      })
      .label('farm document'),
    farm: Joi.object().keys({
      farm_name: Joi.string(),
      total_area: Joi.number(),
      total_agricultural_area: Joi.number(),
      total_vegetation_area: Joi.number(),
      city: Joi.string(),
      state: Joi.string(),
      crops: Joi.array()
        .items(Joi.string())
        .custom((value, helpers) => {
          let errors = 0;
          value.forEach((crop: any) => {
            if (!isCropType(crop)) {
              errors++;
            }
          });

          if (errors > 0) return helpers.error('cropType.invalid');

          return value;
        })
        .label('cropType'),
    }),
  }),
  [Segments.PARAMS]: Joi.object().keys({
    farmer_id: Joi.string().required(),
  }),
});

export const deleteFarmValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    farmer_id: Joi.string().required(),
  }),
});

export const listFarmsValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    page: Joi.number(),
  }),
});

export const getFarmValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    farmer_id: Joi.string().required(),
  }),
});
