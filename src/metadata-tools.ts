import 'reflect-metadata';

export interface MetadataAccessor<T> {
    symbol: symbol;
    createInitial: () => T
}

export function createMetadataAccessor<T>(key: string, initial: () => T): MetadataAccessor<T> {
    return {
        symbol: Symbol(key),
        createInitial: initial
    };
}

export function ensureClassMetadata<T>(metadataAccessor: MetadataAccessor<T>, target: Object): T {
    if (!Reflect.hasOwnMetadata(metadataAccessor.symbol, target)) {
        Reflect.defineMetadata(metadataAccessor.symbol, metadataAccessor.createInitial(), target);
    }
    return Reflect.getOwnMetadata(metadataAccessor.symbol, target);
}

export function getClassMetadata<T>(metadataAccessor: MetadataAccessor<T>, target: Object): T {
    if (!Reflect.hasMetadata(metadataAccessor.symbol, target)) {
        throw new Error(`Class metadata for ${metadataAccessor.symbol.toString()} is missing`);
    }
    return Reflect.getMetadata(metadataAccessor.symbol, target);
}

export function ensurePropertyMetadata<T>(metadataAccessor: MetadataAccessor<T>, target: Object,
                                   propertyKey: string | symbol): T {
    if (!Reflect.hasOwnMetadata(metadataAccessor.symbol, target, propertyKey)) {
        Reflect.defineMetadata(metadataAccessor.symbol, metadataAccessor.createInitial(), target, propertyKey);
    }
    return Reflect.getOwnMetadata(metadataAccessor.symbol, target, propertyKey);
}

export function getPropertyMetadata<T>(metadataAccessor: MetadataAccessor<T>, target: Object,
                                propertyKey: string | symbol): T {
    if (!Reflect.hasMetadata(metadataAccessor.symbol, target, propertyKey)) {
        throw new Error(`Property metadata for ${metadataAccessor.symbol.toString()} is missing`);
    }
    return Reflect.getMetadata(metadataAccessor.symbol, target, propertyKey);
}
