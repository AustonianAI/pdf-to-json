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
  food_items: {
    description: 'All of the food items on the menu.',
    type: 'array',
    items: {
      food_name: {
        description: 'The title of the food item',
        type: 'string',
        example: 'The Classic Burger',
      },
      food_price: {
        description: 'The price of the food item',
        type: 'string',
        example: '$10',
      },
      // food_description: {
      //   description: 'A description of the food item',
      //   type: 'string',
      //   example: 'A classic burger with lettuce, tomato, and pickles',
      // },
    },
  },
  menu_price_range: {
    description:
      'The price range of the restaurant expressed as $, $$, $$$, or $$$$',
    type: 'string',
    example: '$$',
  },
};
