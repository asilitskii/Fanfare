# Web Frontend:

## Running a local copy

### Environment file
You must configure .env file in root of the project. Example [here](./example.env)

* VITE_NODE_ENV [local | production] mode of working with API
* VITE_API_URL is url for requests to API (for production mode)
* VITE_LOCAL_API_URL is url for requests to API (for local mode)

### Install Dependencies

Make sure you have [pnpm](https://pnpm.io/) installed. Then, run the following command to install the required dependencies:

```sh
pnpm i
```

### Start the Project

```sh
pnpm run dev
```

## Development Guide

### Creating a New Component

Create a new folder for your component in `src/components/`. The folder name should be in kebab-case (e.g., `my_new_component`).

Create these 3 files in this folder:

1. `MyNewComponent.module.scss` - for styling your component.
2. `MyNewComponent.tsx` - for the component's template.
3. `MyNewComponentContainer.tsx` - for callbacks, logic, etc.

Example for `MyNewComponentContainer.tsx`:
This file manages the logic and state for your component.

```tsx
import {something} from './somewhere';

const MyNewComponentContainer: React.FC = () => {
	const somethingHandler = () => {
		// Your logic here.
	}
	...

	return (
		<MyNewComponent
			doSomething={somethingHandler}
			...
		/>
	);
};

export default MyNewComponentContainer;
```

Example for `MyNewComponent.tsx`:
This file defines the visual structure of your component.

```tsx
import style from './myNewComponent.module.scss';
...

type MyNewComponentPropsType = {
	...
}

const MyNewComponent: React.FC<MyNewComponentPropsType> = ({ doSomething }) => {
	...

	return (
		<div className={style.body}>
			<div className={style.nameBlock}>
				<h1>FANFARE</h1>
			</div>
			...
		</div>
	);
};

export default MyNewComponent;
```

Update `App.tsx`:
Finally, don't forget to update your `App.tsx` to include your new component:

```tsx
...
import MyNewComponentContainer from './components/my_new_component/MyNewComponentContainer';

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				...
				<Route
					path={'/my_new_component'}
					element={
						<div className={style.myStyle}>
							<MyNewComponentContainer />
						</div>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
```

### Generate REST clients

Make sure you install [swagger-typescript-api](https://github.com/acacode/swagger-typescript-api):

```sh
pnpm i swagger-typescript-api
```

Generate: 

```sh
pnpm swagger-typescript-api --axios --single-http-client -p <schema_file> -o .\src\api\ -n <Service>Api.ts --api-class-name <Service>Api
```
For example:

```
pnpm swagger-typescript-api --axios --single-http-client -p .\auth_service_api.yaml -o .\src\api\ -n AuthApi.ts --api-class-name AuthApi
```

After that you must transform generated file for make all variable names in camelCase:

```sh
node ./script/toCamelCaseFile.js <path_to_file>
```

For example

```sh
node ./script/toCamelCaseFile.js ./src/api/UserAPI.ts
```

After that, add you new service api to `src/api/API.ts` like that:

```ts
export const authApi = new AuthApi(httpClient);
```