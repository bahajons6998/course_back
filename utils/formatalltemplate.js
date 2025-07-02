const formatAllTemplate = (templates) => {
    return templates.map((template) => {
      const allInputs = [
        ...template.SingleValueInput.map((input) => ({
          id: input.id,
          name: input.name,
          description: input.description,
          type: input.type,
          required: input.required,
          order: input.order,
          template_id: input.template_id,
          group_id: input.group_id,
          kind: 'SingleValueInput',
        })),
        ...template.MultipleValueInput.map((input) => ({
          id: input.id,
          name: input.name,
          description: input.description,
          type: input.type,
          required: input.required,
          order: input.order,
          template_id: input.template_id,
          group_id: input.group_id,
          up: input.up,
          down: input.down,
          options: input.Option,
          kind: 'MultipleValueInput',
        })),
      ];

      allInputs.sort((a, b) => a.order - b.order);
      return {
        ...template,
        inputs: allInputs,
        SingleValueInput: undefined,
        MultipleValueInput: undefined,
      };
    });
  };

  module.exports = formatAllTemplate;