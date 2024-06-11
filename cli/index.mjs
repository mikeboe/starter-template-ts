#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the CLI program
program
  .version('1.0.0')
  .description('A full-stack application scaffolding tool')
  .action(async () => {
    // Prompt for project name and folder
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Enter the project name:',
      },
      {
        type: 'input',
        name: 'projectDirectory',
        message: 'Enter the project directory (use . for current directory):',
        default: '.',
      },
      {
        type: 'checkbox',
        name: 'services',
        message: 'Select services to include:',
        choices: [
          'api',
          'frontend',
          'website',
          'docs',
          'package',
          'ui-library',
        ],
        validate: function (answer) {
          if (answer.length < 1) {
            return 'You must choose at least one service.';
          }
          if ((answer.includes('ui-library') || answer.includes('package')) && answer.length > 1) {
            return 'You cannot select any other service with ui-library or package.';
          }
          return true;
        },
      },
    ]);

    const { projectName, projectDirectory, services } = answers;

    // Resolve the project path
    const projectPath = path.resolve(process.cwd(), projectDirectory);
    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true });
    }

    // Create main package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
    };

    if (
      (!services.includes('ui-library') || 
      !services.includes('package')) &&
      services.length > 1
    ) {
      packageJson.workspaces = [];
    }

    // Copy selected services
    services.forEach((service) => {
      if (service !== 'ui-library' && service !== 'package') {
      const servicePath = path.join(__dirname, '..', service);
      const destPath = path.join(projectPath, service);
      copyDirectory(servicePath, destPath);
      packageJson.workspaces.push(service);
      } else {
      const servicePath = path.join(__dirname, '..', service);
      const destPath = path.join(projectPath);
      copyDirectory(servicePath, destPath);
      }
    });

      // Copy the Dockerfile.{service} if it exists
      const noDockerfile =
        services.includes('ui-library') || services.includes('package');
      if (!noDockerfile) {
        const dockerfilePath = path.join(
          __dirname,
          '..',
          `Dockerfile.${service}`,
        );
        if (fs.existsSync(dockerfilePath)) {
          fs.copyFileSync(
            dockerfilePath,
            path.join(projectPath, `Dockerfile.${service}`),
          );
        }
      }
   

    // Copy the misc folder if website, docs, or frontend is selected
    const miscRequired = services.some((service) =>
      ['frontend', 'website', 'docs'].includes(service),
    );
    if (miscRequired) {
      const miscPath = path.join(__dirname, '..', 'misc');
      const destPath = path.join(projectPath, 'misc');
      copyDirectory(miscPath, destPath);
    }

    // Copy other necessary files from the root
    const otherFiles = ['.prettierrc', '.gitignore']; // Add other file names as needed
    otherFiles.forEach((file) => {
      const srcPath = path.join(__dirname, '..', file);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(projectPath, file));
      }
    });

    // Write the main package.json
    if (
      (!services.includes('ui-library') || !services.includes('package')) && services.length > 1
    ) {
      const packageJsonPath = path.join(projectPath, 'package.json');
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }

    // Generate the README file
    generateReadme(projectName, services, projectPath);

    // Generate the docker-compose.yml file
    if ((!services.includes('ui-library') || !services.includes('package')) && services.length > 1) {
      generateDockerCompose(services, projectPath);
    }

    console.log('Project created successfully!');
  })

program.parse(process.argv);

// Utility function to copy directory
function copyDirectory(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    entry.isDirectory()
      ? copyDirectory(srcPath, destPath)
      : fs.copyFileSync(srcPath, destPath);
  }
}

// Function to generate the README file
function generateReadme(projectName, services, projectPath) {
  let readmeContent = '';

  if (!services.includes('ui-library') && !services.includes('package')) {
    readmeContent = fs.readFileSync(
      path.join(__dirname, 'README', 'general.md'),
      'utf-8',
    );
    readmeContent = readmeContent.replace('Project Name', projectName);

    services.forEach((service) => {
      const serviceReadmePath = path.join(__dirname, 'README', `${service}.md`);
      if (fs.existsSync(serviceReadmePath)) {
        const serviceContent = fs.readFileSync(serviceReadmePath, 'utf-8');
        readmeContent += `\n\n${serviceContent}`;
      }
    });
  } else {
    readmeContent = fs.readFileSync(
      path.join(__dirname, 'README', 'general-ui-lib.md'),
      'utf-8',
    );

    readmeContent = readmeContent.replace('Project Name', projectName);

    const serviceReadmePath = path.join(__dirname, 'README', `${services[0]}.md`);
    if (fs.existsSync(serviceReadmePath)) {
      const serviceContent = fs.readFileSync(serviceReadmePath, 'utf-8');
      readmeContent += `\n\n${serviceContent}`;
    }
  }
  fs.writeFileSync(path.join(projectPath, 'README.md'), readmeContent);
}

// Function to generate the docker-compose.yml file
function generateDockerCompose(services, projectPath) {
  let dockerComposeContent = fs.readFileSync(
    path.join(__dirname, 'docker-compose', 'general.yml'),
    'utf-8',
  );

  services.forEach((service) => {
    const serviceDockerComposePath = path.join(
      __dirname,
      'docker-compose',
      `${service}.yml`,
    );
    if (fs.existsSync(serviceDockerComposePath)) {
      const serviceContent = fs.readFileSync(serviceDockerComposePath, 'utf-8');
      dockerComposeContent += `\n${serviceContent}`;
    }
  });

  // Add the volumes section if the api service is selected
  if (services.includes('api')) {
    const volumesContent = fs.readFileSync(
      path.join(__dirname, 'docker-compose', 'volumes.yml'),
      'utf-8',
    );
    dockerComposeContent += `\n${volumesContent}`;
  }

  fs.writeFileSync(
    path.join(projectPath, 'docker-compose.yml'),
    dockerComposeContent,
  );
}
