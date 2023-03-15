const sample_data = {
  restuarant_name: {
    description: 'The name of the restuarant',
    type: 'string',
  },
  restuarant_address: {
    description: 'The address of the restuarant',
    type: 'string',
  },
  restuarant_phone: {
    description: 'The phone number of the restuarant',
    type: 'string',
  },
  'food_type:': {
    description: 'The type of food served at the restuarant',
    type: 'string',
  },
  food_items: {
    description: 'The menu items of the restuarant',
    type: 'array',
    items: {
      food_name: {
        description: 'The title of the menu item',
        type: 'string',
      },
      food_price: {
        description: 'The price of the menu item',
        type: 'string',
      },
      food_description: {
        description: 'The description of the menu item',
        type: 'string',
      },
    },
  },
  food_price_range: {
    description:
      'The price range of the restuarant expressed as $, $$, $$$, or $$$$',
    type: 'string',
  },
};
