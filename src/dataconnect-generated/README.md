# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetJobApplicationsByUser*](#getjobapplicationsbyuser)
  - [*ListCompanies*](#listcompanies)
- [**Mutations**](#mutations)
  - [*CreateJobApplication*](#createjobapplication)
  - [*UpdateJobApplicationStatus*](#updatejobapplicationstatus)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetJobApplicationsByUser
You can execute the `GetJobApplicationsByUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getJobApplicationsByUser(vars: GetJobApplicationsByUserVariables): QueryPromise<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;

interface GetJobApplicationsByUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetJobApplicationsByUserVariables): QueryRef<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;
}
export const getJobApplicationsByUserRef: GetJobApplicationsByUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getJobApplicationsByUser(dc: DataConnect, vars: GetJobApplicationsByUserVariables): QueryPromise<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;

interface GetJobApplicationsByUserRef {
  ...
  (dc: DataConnect, vars: GetJobApplicationsByUserVariables): QueryRef<GetJobApplicationsByUserData, GetJobApplicationsByUserVariables>;
}
export const getJobApplicationsByUserRef: GetJobApplicationsByUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getJobApplicationsByUserRef:
```typescript
const name = getJobApplicationsByUserRef.operationName;
console.log(name);
```

### Variables
The `GetJobApplicationsByUser` query requires an argument of type `GetJobApplicationsByUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetJobApplicationsByUserVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetJobApplicationsByUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetJobApplicationsByUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetJobApplicationsByUserData {
  jobApplications: ({
    id: UUIDString;
    company: {
      name: string;
    };
      applicationDate: DateString;
      positionTitle: string;
      status: string;
  } & JobApplication_Key)[];
}
```
### Using `GetJobApplicationsByUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getJobApplicationsByUser, GetJobApplicationsByUserVariables } from '@dataconnect/generated';

// The `GetJobApplicationsByUser` query requires an argument of type `GetJobApplicationsByUserVariables`:
const getJobApplicationsByUserVars: GetJobApplicationsByUserVariables = {
  userId: ..., 
};

// Call the `getJobApplicationsByUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getJobApplicationsByUser(getJobApplicationsByUserVars);
// Variables can be defined inline as well.
const { data } = await getJobApplicationsByUser({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getJobApplicationsByUser(dataConnect, getJobApplicationsByUserVars);

console.log(data.jobApplications);

// Or, you can use the `Promise` API.
getJobApplicationsByUser(getJobApplicationsByUserVars).then((response) => {
  const data = response.data;
  console.log(data.jobApplications);
});
```

### Using `GetJobApplicationsByUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getJobApplicationsByUserRef, GetJobApplicationsByUserVariables } from '@dataconnect/generated';

// The `GetJobApplicationsByUser` query requires an argument of type `GetJobApplicationsByUserVariables`:
const getJobApplicationsByUserVars: GetJobApplicationsByUserVariables = {
  userId: ..., 
};

// Call the `getJobApplicationsByUserRef()` function to get a reference to the query.
const ref = getJobApplicationsByUserRef(getJobApplicationsByUserVars);
// Variables can be defined inline as well.
const ref = getJobApplicationsByUserRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getJobApplicationsByUserRef(dataConnect, getJobApplicationsByUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.jobApplications);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.jobApplications);
});
```

## ListCompanies
You can execute the `ListCompanies` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCompanies(): QueryPromise<ListCompaniesData, undefined>;

interface ListCompaniesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCompaniesData, undefined>;
}
export const listCompaniesRef: ListCompaniesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCompanies(dc: DataConnect): QueryPromise<ListCompaniesData, undefined>;

interface ListCompaniesRef {
  ...
  (dc: DataConnect): QueryRef<ListCompaniesData, undefined>;
}
export const listCompaniesRef: ListCompaniesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCompaniesRef:
```typescript
const name = listCompaniesRef.operationName;
console.log(name);
```

### Variables
The `ListCompanies` query has no variables.
### Return Type
Recall that executing the `ListCompanies` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCompaniesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCompaniesData {
  companies: ({
    id: UUIDString;
    name: string;
    industry?: string | null;
    website?: string | null;
  } & Company_Key)[];
}
```
### Using `ListCompanies`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCompanies } from '@dataconnect/generated';


// Call the `listCompanies()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCompanies();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCompanies(dataConnect);

console.log(data.companies);

// Or, you can use the `Promise` API.
listCompanies().then((response) => {
  const data = response.data;
  console.log(data.companies);
});
```

### Using `ListCompanies`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCompaniesRef } from '@dataconnect/generated';


// Call the `listCompaniesRef()` function to get a reference to the query.
const ref = listCompaniesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCompaniesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.companies);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.companies);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateJobApplication
You can execute the `CreateJobApplication` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createJobApplication(vars: CreateJobApplicationVariables): MutationPromise<CreateJobApplicationData, CreateJobApplicationVariables>;

interface CreateJobApplicationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateJobApplicationVariables): MutationRef<CreateJobApplicationData, CreateJobApplicationVariables>;
}
export const createJobApplicationRef: CreateJobApplicationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createJobApplication(dc: DataConnect, vars: CreateJobApplicationVariables): MutationPromise<CreateJobApplicationData, CreateJobApplicationVariables>;

interface CreateJobApplicationRef {
  ...
  (dc: DataConnect, vars: CreateJobApplicationVariables): MutationRef<CreateJobApplicationData, CreateJobApplicationVariables>;
}
export const createJobApplicationRef: CreateJobApplicationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createJobApplicationRef:
```typescript
const name = createJobApplicationRef.operationName;
console.log(name);
```

### Variables
The `CreateJobApplication` mutation requires an argument of type `CreateJobApplicationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateJobApplicationVariables {
  companyId: UUIDString;
  userId: UUIDString;
  applicationDate: DateString;
  positionTitle: string;
  status: string;
}
```
### Return Type
Recall that executing the `CreateJobApplication` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateJobApplicationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateJobApplicationData {
  jobApplication_insert: JobApplication_Key;
}
```
### Using `CreateJobApplication`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createJobApplication, CreateJobApplicationVariables } from '@dataconnect/generated';

// The `CreateJobApplication` mutation requires an argument of type `CreateJobApplicationVariables`:
const createJobApplicationVars: CreateJobApplicationVariables = {
  companyId: ..., 
  userId: ..., 
  applicationDate: ..., 
  positionTitle: ..., 
  status: ..., 
};

// Call the `createJobApplication()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createJobApplication(createJobApplicationVars);
// Variables can be defined inline as well.
const { data } = await createJobApplication({ companyId: ..., userId: ..., applicationDate: ..., positionTitle: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createJobApplication(dataConnect, createJobApplicationVars);

console.log(data.jobApplication_insert);

// Or, you can use the `Promise` API.
createJobApplication(createJobApplicationVars).then((response) => {
  const data = response.data;
  console.log(data.jobApplication_insert);
});
```

### Using `CreateJobApplication`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createJobApplicationRef, CreateJobApplicationVariables } from '@dataconnect/generated';

// The `CreateJobApplication` mutation requires an argument of type `CreateJobApplicationVariables`:
const createJobApplicationVars: CreateJobApplicationVariables = {
  companyId: ..., 
  userId: ..., 
  applicationDate: ..., 
  positionTitle: ..., 
  status: ..., 
};

// Call the `createJobApplicationRef()` function to get a reference to the mutation.
const ref = createJobApplicationRef(createJobApplicationVars);
// Variables can be defined inline as well.
const ref = createJobApplicationRef({ companyId: ..., userId: ..., applicationDate: ..., positionTitle: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createJobApplicationRef(dataConnect, createJobApplicationVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.jobApplication_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.jobApplication_insert);
});
```

## UpdateJobApplicationStatus
You can execute the `UpdateJobApplicationStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateJobApplicationStatus(vars: UpdateJobApplicationStatusVariables): MutationPromise<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;

interface UpdateJobApplicationStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateJobApplicationStatusVariables): MutationRef<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;
}
export const updateJobApplicationStatusRef: UpdateJobApplicationStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateJobApplicationStatus(dc: DataConnect, vars: UpdateJobApplicationStatusVariables): MutationPromise<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;

interface UpdateJobApplicationStatusRef {
  ...
  (dc: DataConnect, vars: UpdateJobApplicationStatusVariables): MutationRef<UpdateJobApplicationStatusData, UpdateJobApplicationStatusVariables>;
}
export const updateJobApplicationStatusRef: UpdateJobApplicationStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateJobApplicationStatusRef:
```typescript
const name = updateJobApplicationStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateJobApplicationStatus` mutation requires an argument of type `UpdateJobApplicationStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateJobApplicationStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateJobApplicationStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateJobApplicationStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateJobApplicationStatusData {
  jobApplication_update?: JobApplication_Key | null;
}
```
### Using `UpdateJobApplicationStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateJobApplicationStatus, UpdateJobApplicationStatusVariables } from '@dataconnect/generated';

// The `UpdateJobApplicationStatus` mutation requires an argument of type `UpdateJobApplicationStatusVariables`:
const updateJobApplicationStatusVars: UpdateJobApplicationStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateJobApplicationStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateJobApplicationStatus(updateJobApplicationStatusVars);
// Variables can be defined inline as well.
const { data } = await updateJobApplicationStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateJobApplicationStatus(dataConnect, updateJobApplicationStatusVars);

console.log(data.jobApplication_update);

// Or, you can use the `Promise` API.
updateJobApplicationStatus(updateJobApplicationStatusVars).then((response) => {
  const data = response.data;
  console.log(data.jobApplication_update);
});
```

### Using `UpdateJobApplicationStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateJobApplicationStatusRef, UpdateJobApplicationStatusVariables } from '@dataconnect/generated';

// The `UpdateJobApplicationStatus` mutation requires an argument of type `UpdateJobApplicationStatusVariables`:
const updateJobApplicationStatusVars: UpdateJobApplicationStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateJobApplicationStatusRef()` function to get a reference to the mutation.
const ref = updateJobApplicationStatusRef(updateJobApplicationStatusVars);
// Variables can be defined inline as well.
const ref = updateJobApplicationStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateJobApplicationStatusRef(dataConnect, updateJobApplicationStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.jobApplication_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.jobApplication_update);
});
```

