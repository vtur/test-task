import { ClientService } from './services/clientService'

const clientService = new ClientService('http://localhost:3000');

const notAuth = [
  { label: 'Register user', action: () => clientService.registerUser() },
  { label: 'Login', action: () => clientService.loginUser() },
];

const auth = [
  { label: 'Get all cars', action: () => clientService.getCars() },
  { label: 'Add car', action: () => clientService.addCar() },
  { label: 'Update car', action: () => clientService.updateCar() },
  { label: 'Delete car', action: () => clientService.deleteCar() },
  { label: 'Get cars by brand', action: () => clientService.getCarsByBrand() },
];

async function main() {


  while (true) {
    console.log(`\nChoose an option:`);
    const options = clientService.isAuth() ? auth : notAuth;
    options.forEach((option, index) => {
      console.log(`${index + 1}. ${option.label}`);
    });
    console.log(`${options.length + 1}. Exit`);

    const selectedOptionIndex = Number(await clientService.askOptionNumber());
    if(selectedOptionIndex -1 === options.length) return;
    const selectedOption = options[selectedOptionIndex - 1];

    if (selectedOption) {
      console.log(`You selected: ${selectedOption.label}`);
      await selectedOption.action()
    } else {
      console.log('Invalid option. Please try again.');
    }
  }
}

main().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
