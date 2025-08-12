// Type definitions for the CHEO Ontology Backend application

// Base SPARQL Query Result Types
export interface SparqlLiteral {
  type: "literal";
  value: string;
}

export interface SparqlUri {
  type: "uri";
  value: string;
}

export type SparqlValue = SparqlLiteral | SparqlUri;

// Generic SPARQL Result - can be extended for any entity type
export interface BaseSparqlResult {
  [key: string]: SparqlValue | undefined;
}

// Specific SPARQL Result Types
export interface CharacterSparqlResult extends BaseSparqlResult {
  character?: SparqlUri;
  name?: SparqlLiteral;
  description?: SparqlLiteral;
  gender?: SparqlLiteral;
  role?: SparqlLiteral;
}

export interface SceneSparqlResult extends BaseSparqlResult {
  scene?: SparqlUri;
  name?: SparqlLiteral;
  description?: SparqlLiteral;
  act?: SparqlLiteral;
  location?: SparqlLiteral;
}

export interface PlaySparqlResult extends BaseSparqlResult {
  play?: SparqlUri;
  title?: SparqlLiteral;
  author?: SparqlLiteral;
  description?: SparqlLiteral;
  genre?: SparqlLiteral;
  year?: SparqlLiteral;
}

// Base Entity Interface
export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
}

// Specific Entity Types
export interface Character extends BaseEntity {
  gender?: string;
  role?: string;
}

export interface Scene extends BaseEntity {
  act?: string;
  location?: string;
  characters?: string[];
}

export interface Play extends BaseEntity {
  title?: string;
  author?: string;
  genre?: string;
  year?: number;
  scenes?: string[];
  characters?: string[];
}

// Generic API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export interface ErrorResponse extends ApiResponse<null> {
  success: false;
  message: string;
}

// Generic Search Request Types
export interface BaseSearchRequest {
  name?: string;
  description?: string;
}

export interface SearchCharacterRequest extends BaseSearchRequest {
  gender?: string;
  role?: string;
}

export interface SearchSceneRequest extends BaseSearchRequest {
  act?: string;
  location?: string;
}

export interface SearchPlayRequest extends BaseSearchRequest {
  title?: string;
  author?: string;
  genre?: string;
  year?: number;
}

// Extended Entity Types (for future use)
export interface CharacterWithRelations extends Character {
  relations?: EntityRelation[];
  sceneIds?: string[];
  playIds?: string[];
}

export interface SceneWithRelations extends Omit<Scene, "characters"> {
  relations?: EntityRelation[];
  characters?: Character[];
  characterIds?: string[];
  play?: Play;
}

export interface PlayWithRelations extends Omit<Play, "scenes" | "characters"> {
  relations?: EntityRelation[];
  scenes?: Scene[];
  sceneIds?: string[];
  characters?: Character[];
  characterIds?: string[];
}

// Generic Relation Type
export interface EntityRelation {
  type: string;
  relatedTo: string[];
  entityType: "character" | "scene" | "play" | "other";
}

// Generic Search and Filter Types
export interface BaseSearchParams {
  name?: string;
  description?: string;
}

export interface CharacterSearchParams extends BaseSearchParams {
  gender?: string;
  role?: string;
}

export interface SceneSearchParams extends BaseSearchParams {
  act?: string;
  location?: string;
}

export interface PlaySearchParams extends BaseSearchParams {
  title?: string;
  author?: string;
  genre?: string;
  year?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Entity Type Enum
export enum EntityType {
  CHARACTER = "character",
  SCENE = "scene",
  PLAY = "play",
}

// Generic Search Parameters
export interface GenericSearchParams extends BaseSearchParams {
  entityType: EntityType;
  filters?: Record<string, any>;
}

// Ontology-specific types
export interface CheoNamespace {
  prefix: "cheo";
  uri: "http://www.semanticweb.org/asus/ontologies/2025/5/Cheo#";
}

export interface RdfNamespace {
  prefix: "rdf";
  uri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
}

// Generic SPARQL Query Builder Types
export interface SparqlQueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  filters?: SparqlFilter[];
  entityType?: EntityType;
}

export interface SparqlFilter {
  field: string;
  operator:
    | "equals"
    | "contains"
    | "startsWith"
    | "regex"
    | "gt"
    | "lt"
    | "gte"
    | "lte";
  value: string | number;
  caseSensitive?: boolean;
}

// Database Connection Types
export interface GraphDBConfig {
  endpoint: string;
  repository: string;
  username?: string;
  password?: string;
  timeout?: number;
}

// Generic Controller Types
export interface BaseController<T extends BaseEntity> {
  getAll: () => Promise<ApiResponse<T[]>>;
  getById: (id: string) => Promise<ApiResponse<T | null>>;
  search: (params: BaseSearchParams) => Promise<ApiResponse<T[]>>;
}

// Generic Formatter Function Types
export type EntityFormatter<
  TSparql extends BaseSparqlResult,
  TEntity extends BaseEntity
> = (sparqlResults: TSparql[]) => TEntity[];

// Utility Types for Dynamic Entity Handling
export type EntityMap = {
  [EntityType.CHARACTER]: Character;
  [EntityType.SCENE]: Scene;
  [EntityType.PLAY]: Play;
};

export type SparqlResultMap = {
  [EntityType.CHARACTER]: CharacterSparqlResult;
  [EntityType.SCENE]: SceneSparqlResult;
  [EntityType.PLAY]: PlaySparqlResult;
};

export type SearchParamsMap = {
  [EntityType.CHARACTER]: CharacterSearchParams;
  [EntityType.SCENE]: SceneSearchParams;
  [EntityType.PLAY]: PlaySearchParams;
};

// Generic Service Interface
export interface EntityService<T extends EntityType> {
  entityType: T;
  search: (params: SearchParamsMap[T]) => Promise<ApiResponse<EntityMap[T][]>>;
  getAll: () => Promise<ApiResponse<EntityMap[T][]>>;
  getById: (id: string) => Promise<ApiResponse<EntityMap[T] | null>>;
}
