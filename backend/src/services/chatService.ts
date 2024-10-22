import { chatRepository } from "../repository/chatRepository";

const chatRepositoryInstance = new chatRepository()

export class chatService{

    private chatRepository:chatRepository

    constructor(chatRepository:chatRepository){
        this.chatRepository = chatRepository

    }

    async createChat(messageDetails: any) {
        try {
            // Call the repository to save the chat
            const savedChat = await chatRepositoryInstance.createChat(messageDetails);
            return savedChat;
        } catch (error: any) {
            console.error("Error in chatService:", error);
            throw error; // Propagate the error for further handling
        }
    }

    getChat = async (doctorID: string, userID: string): Promise<any> => {
        try {
          return await this.chatRepository.getChat(doctorID, userID);
        } catch (error) {
          throw error;
        };
      };
    

     





}