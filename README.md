# ADAPTAR-IA WEBAPP

## Description

...

## Usage

### 1. Installation

To install the project dependencies, run the following command:

```bash
npm install
```

### 2. Execution

To run the project, execute the following command:

```bash
npm start
```

### 3. Enter the application

To enter the application, open the following URL in your browser:

```bash
http://localhost:3000
```

### 4. Lint & Prettier

To check the code style, run the following command:

```bash
npm run lint
```

To fix the code style, run the following command:

```bash
npm run lint:fix
```


## Deploy

To deploy the project you have to use the Github Workflow.
It will be triggered when you push a new tag to the repository.
For example:

```bash
git tag -a v1.0.0 -m "First version"
git push origin v1.0.0
```

Please, make sure that the tag follows the [Semantic Versioning](https://semver.org/) rules, it starts with the letter 'v', and keep it synchronized with the [package.json](package.json) version.

It will create a Docker image based in [Dockerfile](Dockerfile) and push it to the Github Container Registry.
Then, it will deploy the image in the VM by using the [Deployment](https://github.com/proyecto-arima/deployment) repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```

