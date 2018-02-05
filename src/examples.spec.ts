import {createMetadataAccessor, ensureClassMetadata, ensurePropertyMetadata, getClassMetadata, getPropertyMetadata} from './metadata-tools';

interface ExampleMetadata {
  example?: string,
  initialData: string;
}

interface ClassMetadata {
  properties: string[];
}

const exampleMA = createMetadataAccessor<ExampleMetadata>('Examples:Example', () => ({
  initialData: 'some initial data'
}));

const exampleClassMA = createMetadataAccessor<ClassMetadata>('Examples:ClassExample', () => ({
  properties: []
}));

function ExampleMeta(example: string): (target: any, propertyKey: string) => void {
  return ((target, propertyKey) => {
    ensurePropertyMetadata(exampleMA, target, propertyKey);
    const meta = getPropertyMetadata(exampleMA, target, propertyKey);
    meta.example = example;
  });
}

function MarkProperty(): (target: any, propertyKey: string) => void {
  return ((target, propertyKey) => {
    ensureClassMetadata(exampleClassMA, target);
    const meta = getClassMetadata(exampleClassMA, target);
    meta.properties.push(propertyKey);
  });
}

class Example {
  @MarkProperty()
  @ExampleMeta('Something')
  someProperty: string;

  @MarkProperty()
  otherProp: number;
}

describe('Example usage', () => {
  it('create property metadata', () => {
    const example = new Example();

    const meta = getPropertyMetadata(exampleMA, example, 'someProperty');
    expect(meta).toEqual({
      initialData: 'some initial data',
      example: 'Something'
    })
  });

  it('mark properties', () => {
    const example = new Example();

    const meta = getClassMetadata(exampleClassMA, example);
    expect(meta.properties).toEqual(['someProperty', 'otherProp']);
  })
});
