import { StatefulSchemaPropertyWithTitle } from '@Components/SchemaPropertyInput';

export const restaurant_schema_with_menu: StatefulSchemaPropertyWithTitle[] = [
  {
    title: 'restaurant_name',
    description: 'The name of the restaurant',
    type: 'string',
    example: 'The Fancy Diner',
  },
  {
    title: 'restaurant_address',
    description: 'The address of the restaurant',
    type: 'string',
    example: '123 Main Street, Cityville, State, 12345',
  },
  {
    title: 'restaurant_phone',
    description: 'The phone number of the restaurant',
    type: 'string',
    example: '(123) 456-7890',
  },
  {
    title: 'food_type',
    description: 'The type of food served at the restaurant',
    type: 'string',
    example: 'American',
  },
  {
    title: 'food_items',
    description: 'All of the food items on the menu.',
    type: 'array',
    items: [
      {
        title: 'food_item_name',
        description: 'The title of the food item',
        type: 'string',
        example: 'The Classic Burger',
      },
      {
        title: 'food_item_price',
        description: 'The price of the food item',
        type: 'string',
        example: '$10',
      },
    ],
  },
  {
    title: 'menu_price_range',
    description:
      'The price range of the restaurant expressed as $, $$, $$$, or $$$$',
    type: 'string',
    example: '$$',
  },
];

export const restaurant_schema_without_menu: StatefulSchemaPropertyWithTitle[] =
  [
    {
      title: 'restaurant_name',
      description: 'The name of the restaurant',
      type: 'string',
      example: 'The Fancy Diner',
    },
    {
      title: 'restaurant_address',
      description: 'The address of the restaurant',
      type: 'string',
      example: '123 Main Street, Cityville, State, 12345',
    },
    {
      title: 'restaurant_phone',
      description: 'The phone number of the restaurant',
      type: 'string',
      example: '(123) 456-7890',
    },
    {
      title: 'food_type',
      description: 'The type of food served at the restaurant',
      type: 'string',
      example: 'American',
    },
    {
      title: 'menu_price_range',
      description:
        'The price range of the restaurant expressed as $, $$, $$$, or $$$$',
      type: 'string',
      example: '$$',
    },
  ];

export const real_estate_brochure_schema: StatefulSchemaPropertyWithTitle[] = [
  {
    title: 'property_address',
    description: 'The address of the property',
    type: 'string',
    example: '123 Main Street, Cityville, State, 12345',
  },
  {
    title: 'property_description',
    description:
      'A description of the property enticing the view to contact the broker',
    type: 'string',
    example:
      'Check out this great retail location with high traffic counts and great visibility!',
  },
  {
    title: 'residential_population_one_mile',
    description: 'The residential population within a mile of the property',
    type: 'string',
    example: '10,000',
  },
  {
    title: 'broker_contact_name',
    description: 'The name(s) of the broker to contact',
    type: 'string',
    example: 'John Doe',
  },
  {
    title: 'broker_contact_phone',
    description: 'The phone number of the broker to contact',
    type: 'string',
    example: '(123) 456-7890',
  },
  {
    title: 'listing_broker_company',
    description: 'The company name of the broker listing the property',
    type: 'string',
    example: 'ABC Realty',
  },
];

export const invoice_schema: StatefulSchemaPropertyWithTitle[] = [
  {
    title: 'invoice_number',
    description: 'The number of the invoice',
    type: 'string',
    example: '12345',
  },
  {
    title: 'vendor_name',
    description: 'The name of the vendor',
    type: 'string',
    example: 'ABC Company',
  },
  {
    title: 'invoice_date',
    description: 'The date the invoice was issued',
    type: 'string',
    example: '2021-01-01',
  },
  {
    title: 'invoice_due_date',
    description: 'The date the invoice is due',
    type: 'string',
    example: '2021-01-15',
  },
  {
    title: 'invoice_amount',
    description: 'The amount of the invoice',
    type: 'string',
    example: '$1,000.00',
  },
  {
    title: 'invoice_items',
    description: 'All of the items on the invoice.',
    type: 'array',
    items: [
      {
        title: 'invoice_item_name',
        description: 'The title of the invoice item',
        type: 'string',
        example: 'The Classic Burger',
      },
      {
        title: 'invoice_item_price',
        description: 'The price of the invoice item',
        type: 'string',
        example: '$10',
      },
    ],
  },
];
