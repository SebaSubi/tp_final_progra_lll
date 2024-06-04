import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';


interface Message {
    text: string;
    author: string;
    sentAt: string;
    attachments: string[];
    recipient: string;
    timestamp: string;
}

const getMessages = async () => {
    try {
        const response = await fetch('/api/messages');

        if(!response.ok) {
            throw new Error('Error fetching messages');
        }
            
        const data = await response.json();
        console.log(data); 
        return data;
    } catch (error) {
        console.error(error);
        return { error: 'Error fetching messages' }; 
    }
}

const InboxSection = () => {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [showMessages, setShowMessages] = useState(false);

    useEffect(() => {
      const fetchMessages = async () => {
          const allMessages = await getMessages();
          const userMessages = allMessages.filter((msg: Message) => msg.recipient === (session?.user as any)?.fullname);
          setMessages(userMessages);
      };
      fetchMessages();
  }, [session]);

    return (
        <div className="fixed top-0 right-2/5 transform -translate-x-1/2 mt-4 flex flex-col items-center w-full max-w-2xl z-10">
            <button onClick={() => setShowMessages(!showMessages)} className="p-2 bg-black text-white border border-white rounded-lg font-bold uppercase duration-200 hover:bg-gray-900 mb-4">
                {showMessages ? 'Close inbox' : 'Open inbox'}
            </button>
            {showMessages && 
                <div className="relative w-full">
                    <img src="/cart.jpg" alt="Background" className="w-full h-auto object-cover rounded-lg" style={{ maxHeight: '600px' }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 overflow-hidden">
                        <div className="w-full max-w-lg bg-transparent p-4 rounded-lg shadow-md" style={{ maxHeight: '500px',scrollbarWidth: 'none', scrollbarColor: 'transparent transparent', overflowY: 'auto' }}>
                        <h2 style={{textShadow: '3px 3px 2px rgba(255, 0, 0, 0.5)'}} className="text-4xl font-bold mb-6 text-center w-full text-red-500 mr-5"> INBOX </h2>
                            <div className="message-section" style={{ overflowY: 'auto', maxHeight: '300px', marginTop: '0.8rem', scrollbarWidth: 'none', scrollbarColor: 'transparent transparent', msOverflowStyle: 'none' }}>
                                {messages.map((msg, index) => (
                                    <div key={index} style={{ border: '1px solid black', padding: '5px', margin: '5px', borderRadius: '5px' }}>
                                        <p style={{ fontSize: '17px', fontWeight: 'bold', color: 'black', textDecoration: 'underline', textUnderlineOffset: '0.15em' }}>
                                            From: "{msg.author === msg.recipient ? 'You' : msg.author}"
                                        </p>
                                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'black' }}>{msg.text}</p>
                                        <p style={{ fontSize: '12px', color: 'black' }}>{new Date(msg.sentAt).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                         
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default InboxSection;