import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView } from 'react-native';import { addLike, addPost, getPosts, checkLike, addComment, getComments } from '../utils/api';
import { AuthContext } from '../contexts/AuthContext';


const CommunityHubScreen = () => {
    const [postText, setPostText] = useState('');
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});

    const handleAddPost = async () => {
        
        await addPost(postText, user.uid);
        setPostText('');
    };
    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await getPosts();
            setPosts(fetchedPosts);
        };
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {        
        const alreadyLiked = await checkLike(postId, user.uid);
        if (!alreadyLiked) {
          await addLike(postId, user.uid);
        }
      };

    const [commentText, setCommentText] = useState('');

    const handleAddComment = async (postId) => {
        await addComment(postId, user.uid, commentText);
    };

    useEffect(() => {
        const fetchComments = async () => {
            const newComments = {};
            for (const post of posts) {
                newComments[post.id] = await getComments(post.id);
            }
            setComments(prevComments => ({ ...prevComments, ...newComments }));
        };
        fetchComments();
    }, [posts]);
    return (
        <View style={styles.mainView}>
            <Text style={styles.text}>Community Hub Screen</Text>
            <Text>New Post:</Text>
            <TextInput
                style={styles.input}
                value={postText}
                onChangeText={setPostText}
            />
            <Button title="Add Post" onPress={handleAddPost} />
            <ScrollView style={styles.postsContainer}>

                {posts.map((post, index) =>
                    <View key={index} style={styles.postContainer}>
                        <Text >{post.text}</Text>
                        <Button title="Like" onPress={() => handleLike(post.id)} />
                        <Text>Add Comment:</Text>
                        <TextInput
                            style={styles.input}
                            value={commentText}
                            onChangeText={setCommentText}
                        />
                        <Button title="Add Comment" onPress={() => handleAddComment(post.id)} />
                       {comments[post.id] && comments[post.id].map((comment, index) => (
                            <Text key={index}>
                                {comment.comment}
                            </Text>
                        ))}

                    </View>)}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    width: '100%',
    marginBottom: 10,
    padding: 10,
  },
  postsContainer: {
    marginTop: 20,
  },
  postContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
});

export default CommunityHubScreen;