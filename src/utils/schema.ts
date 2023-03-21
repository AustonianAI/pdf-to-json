import { Schema, SchemaProperty } from '../types/schemaTypes';

const generateSubSchemaSummary = (
  schema: Schema,
  includeArrays: boolean = true,
): string[] => {
  const summary: string[] = [];

  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      if (includeArrays) {
        summary.push(`${key} (${property.type}): ${property.description}`);
      }
    } else {
      summary.push(`${key} (${property.type}): ${property.description}`);
    }
  }

  return summary;
};

const generateExample = (
  schema: Schema,
  schemaKeys: string[],
  includeArrays: boolean = true,
): any[] => {
  const example: any[] = [];

  for (const key of schemaKeys) {
    const property = schema[key.split(' ')[0]];

    if (property.type === 'array' && property.items && includeArrays) {
      example.push([
        generateExample(
          property.items,
          generateSubSchemaSummary(property.items, true),
        ),
      ]);
    } else {
      example.push(property.example);
    }
  }

  return example;
};

export const generateSchemaSummaries = (schema: Schema): any[] => {
  const summaries: any[] = [];

  const mainSchemaKeys = generateSubSchemaSummary(schema, false);

  const mainSchemaExample = generateExample(schema, mainSchemaKeys, false);
  summaries.push(
    `[ "${mainSchemaKeys.join(
      '", "',
    )}" ]\n\nAn example of the data in this format is \n [ "${mainSchemaExample.join(
      '", "',
    )}" ] `,
  );

  for (const key in schema) {
    const property = schema[key];

    if (property.type === 'array' && property.items) {
      const arraySchemaKeys = generateSubSchemaSummary(property.items, true);

      const arraySchemaExample = generateExample(
        property.items,
        arraySchemaKeys,
        true,
      );
      summaries.push(
        `[ [ "${arraySchemaKeys.join(
          '", "',
        )}"] ]\n\nEach item should be in a nested array, like this example: \n [ [ "${arraySchemaExample.join(
          '", "',
        )}" ] ]`,
      );
    }
  }

  return summaries;
};

const data = [
  [
    'MUSHROOM CROQUETTES',
    '$7',
    'Potato, parmesan, and mushroom croquettes with horseradish crema.',
    'Starters',
  ],
  [
    'KALE CAESAR SALAD',
    '$9',
    'Lacinato kale salad with crispy chickpeas, shaved parmesan, sourdough croutons, and housemade caesar dressing. Grilled chicken can be added for an additional $3.',
    'Starters',
  ],
  [
    'BURGER BOX SLIDERS',
    '$10',
    'Kilcoyne beef sliders with grilled onions, cheddar cheese, pickles, and box sauce.',
    'Starters',
  ],
  [
    'CAULIFLOWER SLIDERS',
    '$10',
    'Beer battered cauliflower sliders with Thai chili BBQ, jalapeño slaw, and garlic aioli.',
    'Starters',
  ],
  [
    'THE SPREAD',
    '$15',
    'Whipped herb ricotta with roasted red pepper, garlic confit, kalamata olives, onion jam, pickled shallot, and sourdough. Served with fresh-cut fries.',
    'Starters',
  ],
  [
    'CLASSIC FRIES',
    '$4 / $6',
    'Fresh-cut fries with salt and true ketchup.',
    'Sides',
  ],
  [
    'PARM HERB FRIES',
    '$5 / $7',
    'Fresh-cut fries with parmesan, rosemary, thyme, and garlic aioli.',
    'Sides',
  ],
  [
    'SPICY PARM FRIES',
    '$5 / $7',
    'Fresh-cut fries with parmesan and cajun seasoning.',
    'Sides',
  ],
  [
    'SALT & VINEGAR FRIES',
    '$5 / $7',
    'Fresh-cut fries with salt and vinegar crema.',
    'Sides',
  ],
  [
    'GARLIC FRIES',
    '$5 / $7',
    'Fresh-cut fries with chopped garlic and dill.',
    'Sides',
  ],
  [
    'CLASSIC FRACHOS',
    '$10',
    'Beef frachos with lager beer cheese, lettuce, tomato, onion, pickle, and box sauce.',
    'Entrees',
  ],
  [
    'BUFFALO FRACHOS',
    '$10',
    'Frachos with box hot sauce, blue cheese crumbles, blue cheese dressing, and celery.',
    'Entrees',
  ],
  [
    'SUPREME FRACHOS',
    '$10',
    'Frachos with lager beer cheese, tomato, jalapeño, olive, bell pepper, black bean, and onion.',
    'Entrees',
  ],
  [
    'CHIMI FRACHOS',
    '$10',
    'Frachos with chimichurri, charred onion, tomato, and red bell pepper.',
    'Entrees',
  ],
  [
    'CHOWDER FRACHOS',
    '$10',
    'Frachos with clam chowder, bacon, and green onion.',
    'Entrees',
  ],
  [
    'LEMONGRASS FRACHOS',
    '$10',
    'Frachos with Thai chili sauce, chopped peanut, pickled carrot, and scallion crema.',
    'Entrees',
  ],
  [
    'THE CLASSIC BURGER',
    '$12',
    'Kilcoyne beef burger with cheddar, lettuce, tomato, onion, pickle, and box sauce. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE GARLIC ROSEMARY BURGER',
    '$13',
    'Kilcoyne beef burger with rosemary onion jam, garlic aioli, tomato, and arugula. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE PICKLED VEGGIE BURGER',
    '$13',
    'Kilcoyne beef burger with cheddar, pickled veggie slaw, and kalamata dijonnaise. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE HORSERADISH BURGER',
    '$13',
    'Kilcoyne beef burger with Swiss cheese, pan fried mushrooms with herbs, pickled shallot, horseradish crema, and arugula. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE SPICY BLUE BURGER',
    '$13',
    'Kilcoyne beef burger with blue cheese crumbles, blue cheese dressing, box hot sauce, lettuce, and onion. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE SPICY BBQ BURGER',
    '$13',
    'Kilcoyne beef burger with smoked gouda, bacon, jalapeño, house BBQ, and spicy jalapeño slaw. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE MAC AND CHEESE BURGER',
    '$13',
    'Kilcoyne beef burger with cheddar, mac and cheese, sriracha aioli, caramelized onion, and hot cherry pepper. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE JALAPEÑO POPPER BURGER',
    '$13',
    'Kilcoyne beef burger with cheddar, bacon, and jalapeño cream cheese popper. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE PEANUT BUTTER BURGER',
    '$13',
    'Kilcoyne beef burger with cheddar, creamy housemade peanut butter, bacon, and pickle. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'THE CONCA D’ORO BURGER',
    '$13',
    'Pepperoni pizza bun with Kilcoyne beef burger, mozzarella, basil aioli, and arugula.',
    'Entrees',
  ],
  [
    'THE CHIMI BURGER',
    '$14',
    'Grilled halloumi burger with roasted red pepper, chimichurri aioli, charred onion, and arugula. Served on a brioche bun.',
    'Entrees',
  ],
  [
    'ICE CREAM BURGER',
    '$6',
    'Caramelized brioche with Dressel Farms chocolate or vanilla ice cream.',
    'Desserts',
  ],
  [
    'FRIESCREAM',
    '$8',
    'French fries with Dressel Farms vanilla ice cream, candied bacon, caramel, and cocoa nibs.',
    'Desserts',
  ],
  [
    'ROOT BEER FLOAT',
    '$6',
    'Boylan root beer with 2 scoops of ice cream. Flavor varies by week.',
    'Desserts',
  ],
  [
    'ADULT BEER FLOAT',
    '$9',
    'Local craft beer or sangria with 2 scoops of ice cream. Flavor varies by week.',
    'Desserts',
  ],
  [
    'ROUND FOR THE KITCHEN',
    '$6',
    'Buy a round of beers for the kitchen staff to show your appreciation.',
    'Beverages',
  ],
  [
    'BOYLAN REAL CANE SUGAR SODA',
    '$4',
    'Choice of cola, diet cola, black cherry, root beer, or Shirley Temple.',
    'Beverages',
  ],
  ['SARATOGA SPARKLING', '$3', null, 'Beverages'],
  ['LAVENDER LEMONADE', '$3', null, 'Beverages'],
  ['HERBAL ICED TEA', '$3', 'Flavor varies by week.', 'Beverages'],
];
