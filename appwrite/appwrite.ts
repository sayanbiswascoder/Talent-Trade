import { Client, Account, ID, Models, Storage } from 'react-native-appwrite';

const client: Client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68031d14001185bc74f4')
    .setPlatform('com.talenttrade')

const storage: Storage = new Storage(client);

export default client;

export { storage }
