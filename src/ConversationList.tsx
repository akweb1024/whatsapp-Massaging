
import { useEffect, useState } from 'react';
import {
  List,
  ListItemText,
  Typography,
  Avatar,
  ListItemAvatar,
  Divider,
  ListItemButton,
  Badge,
} from '@mui/material';
import { collection, onSnapshot, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { type User } from 'firebase/auth';

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
}

interface ConversationListProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId: string;
}

interface Participant extends User {
    isOnline?: boolean;
}

const ConversationList = ({ onSelectConversation, selectedConversationId }: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [participants, setParticipants] = useState<Record<string, Participant>>({});

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
        const q = query(collection(db, 'conversations'), where('participants', 'array-contains', user.uid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const convos: Conversation[] = [];
          querySnapshot.forEach((doc) => {
            convos.push({ id: doc.id, ...doc.data() } as Conversation);
          });
          setConversations(convos);
        });
    
        return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
        const participantIds = conversations.flatMap(c => c.participants);
        const uniqueParticipantIds = [...new Set(participantIds)];
        const fetchedParticipants: Record<string, Participant> = {};
        for (const id of uniqueParticipantIds) {
            const userDoc = await getDoc(doc(db, "users", id));
            if (userDoc.exists()) {
                fetchedParticipants[id] = userDoc.data() as Participant;
            }
        }
        setParticipants(fetchedParticipants);
    };
    if (conversations.length > 0) {
        fetchParticipants();
    }
  }, [conversations]);

  return (
    <List sx={{ p: 0 }}>
        <Typography variant="h6" sx={{ p: 2, backgroundColor: '#1F2C34', color: 'white' }}>
            Chats
        </Typography>
        <Divider />
      {conversations.map((convo) => {
        const otherParticipantId = convo.participants.find(p => p !== auth.currentUser?.uid);
        const otherParticipant = otherParticipantId ? participants[otherParticipantId] : undefined;

        return (
            <ListItemButton
                key={convo.id}
                onClick={() => onSelectConversation(convo.id)}
                selected={selectedConversationId === convo.id}
                sx={{
                    '&.Mui-selected': {
                        backgroundColor: '#2A3942',
                    },
                    '&:hover': {
                        backgroundColor: '#2A3942',
                    },
                }}
            >
            <ListItemAvatar>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    sx={{
                        '& .MuiBadge-badge': {
                            backgroundColor: otherParticipant?.isOnline ? '#44b700' : '#767676',
                            color: otherParticipant?.isOnline ? '#44b700' : '#767676',
                            boxShadow: `0 0 0 2px #111B21`,
                        },
                    }}
                >
                    <Avatar src={otherParticipant?.photoURL || undefined} />
                </Badge>
            </ListItemAvatar>
            <ListItemText
                primary={otherParticipant?.displayName || 'User'}
                secondary={convo.lastMessage}
                primaryTypographyProps={{ color: 'white' }}
                secondaryTypographyProps={{ color: '#B0B0B0' }}
            />
            </ListItemButton>
        );
      })}
    </List>
  );
};

export default ConversationList;
