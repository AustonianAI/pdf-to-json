import { Schema, SchemaProperty } from '../types/schemaTypes';

export const sample_schema: Record<string, SchemaProperty> = {
  restaurant_name: {
    description: 'The name of the restaurant',
    type: 'string',
    example: 'The Fancy Diner',
  },
  restaurant_address: {
    description: 'The address of the restaurant',
    type: 'string',
    example: '123 Main Street, Cityville, State, 12345',
  },
  restaurant_phone: {
    description: 'The phone number of the restaurant',
    type: 'string',
    example: '(123) 456-7890',
  },
  food_type: {
    description: 'The type of food served at the restaurant',
    type: 'string',
    example: 'American',
  },
  // menu_items: {
  //   description:
  //     'The entrees or main dishes served at the restaurant.  Include up to 10 items.',
  //   type: 'array',
  //   items: {
  //     menu_item_name: {
  //       description: 'The title of the menu item',
  //       type: 'string',
  //       example: 'Burger',
  //     },
  //     menu_item_price: {
  //       description: 'The price of the menu item',
  //       type: 'string',
  //       example: '$10',
  //     },
  //     // menu_item_description: {
  //     //   description:
  //     //     'A tantalizing, one sentence description of the menu item using the ingredients listed.',
  //     //   type: 'string',
  //     //   example: 'A juicy beef burger with lettuce, tomato, and cheese.',
  //     // },
  //     // menu_item_category: {
  //     //   description:
  //     //     'The category of the menu item, such as "Appetizer", "Entree", or "Dessert", or "Beverage", etc.',
  //     //   type: 'string',
  //     //   example: 'Entree',
  //     // },
  //   },
  // },
  menu_price_range: {
    description:
      'The price range of the restaurant expressed as $, $$, $$$, or $$$$',
    type: 'string',
    example: '$$',
  },
};
