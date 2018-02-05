import {
  createMetadataAccessor, ensureClassMetadata, ensurePropertyMetadata, getClassMetadata, getPropertyMetadata,
  MetadataAccessor
} from './metadata-tools';

interface TestMetadata {
  testProperty: string;
}

describe('metadata-tools', () => {
  let testMA: MetadataAccessor<TestMetadata>;

  beforeEach(() => {
    testMA = createMetadataAccessor<TestMetadata>('Test:Test', () => ({
      testProperty: 'example'
    }));
  });

  it('should be able to initialize metadata and read it', () => {
    const obj = {};
    ensureClassMetadata(testMA, obj);
    const meta = getClassMetadata(testMA, obj);
    expect(meta).toEqual({
      testProperty: 'example'
    });
  });

  it('should not remove already stored metadata on init', () => {
    const obj = {};
    ensureClassMetadata(testMA, obj);
    const meta = getClassMetadata(testMA, obj);
    meta.testProperty = 'nextExample';
    ensureClassMetadata(testMA, obj);
    expect(meta).toEqual({
      testProperty: 'nextExample'
    });
  });

  it('should throw exception when class metadata is not present', () => {
    const obj = {};
    expect(() => {
      getClassMetadata(testMA, obj);
    }).toThrowError('Class metadata for Symbol(Test:Test) is missing')
  });

  it('should be able to store and read property metadata', () => {
    const obj = {prop: 'test'};
    ensurePropertyMetadata(testMA, obj, 'prop');
    const meta = getPropertyMetadata(testMA, obj, 'prop');
    expect(meta).toEqual({
      testProperty: 'example'
    });
  });

  it('should not remove already stored property metadata on init', () => {
    const obj = {prop: 'test'};
    ensurePropertyMetadata(testMA, obj, 'prop');
    const meta = getPropertyMetadata(testMA, obj, 'prop');
    meta.testProperty = 'nextExample';
    ensurePropertyMetadata(testMA, obj, 'prop');
    expect(meta).toEqual({
      testProperty: 'nextExample'
    });
  });

  it('should throw exception when property metadata is not present', () => {
    const obj = {prop: 'test'};
    expect(() => {
      getPropertyMetadata(testMA, obj, 'prop');
    }).toThrowError('Property metadata for Symbol(Test:Test) is missing')
  });
});
