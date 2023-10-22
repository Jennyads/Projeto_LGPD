import * as Yup from 'yup'



const registrationSchema = Yup.object().shape({
    prodTitle: Yup.string()
      .min(3, 'O nome do produto deve ter no mínimo 3 caracteres')
      .max(40, 'O nome do produto deve ter no máximo 40 caracteres')
      .required('O nome do produto é obrigatório'),

    prodDescription: Yup.string()
      .max(40, 'A descrição deve ter no máximo 40 caracteres')
      .required('A descrição é obrigatória'),

    prodPrice: Yup.string()
      .required('O preço é obrigatório'),

   
  })
  export default registrationSchema;
