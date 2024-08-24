import { useEffect, useState } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import { MdEdit, MdDelete } from "react-icons/md";

function Todoform() {
    const [posts, SetPosts] = useState([]);
    const [newPost, setNewPost] = useState({ content: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentPostId, setCurrentPostId] = useState(null);
    const [validationMessage, setValidationMessage] = useState("");

    // Fetch data
    useEffect(() => {
        axios.get('http://localhost:3000/posts')
            .then((response) => SetPosts(response.data))
            .catch((err) => console.log('Something went wrong'));
    }, []);

    // Add post
    const addPost = () => {
        axios.post('http://localhost:3000/posts', newPost)
            .then((response) => {
                SetPosts([...posts, response.data]);
                setNewPost({ content: "" });
                setValidationMessage("");
            })
            .catch((err) => console.log('Something went wrong'));
    };

    // Delete post
    const deletePost = (id) => {
        axios.delete(`http://localhost:3000/posts/${id}`)
            .then(() => {
                SetPosts(posts.filter((post) => post.id !== id));
            })
            .catch((err) => console.log('Something went wrong'));
    };

    // Edit post
    const editPost = (item) => {
        setNewPost({ content: item.content });
        setIsUpdating(true);
        setCurrentPostId(item.id);
    };

    // Update post
    const updatedPost = () => {
        axios.put(`http://localhost:3000/posts/${currentPostId}`, newPost)
            .then((response) => {
                SetPosts(posts.map((post) => (post.id === currentPostId ? response.data : post)));
                setNewPost({ content: '' });
                setIsUpdating(false);
                setCurrentPostId(null);
                setValidationMessage("");
            })
            .catch((err) => console.log('Something went wrong'));
    };

    // Handle submit with empty input check
    const handleSubmit = () => {
        if (newPost.content.trim() === "") {
            setValidationMessage("Todo content cannot be empty.");
            return;
        }
        isUpdating ? updatedPost() : addPost();
    };

    // Clear all posts
    const clearAllPosts = () => {
        Promise.all(posts.map(post => axios.delete(`http://localhost:3000/posts/${post.id}`)))
            .then(() => {
                SetPosts([]);
            })
            .catch((err) => console.log('Something went wrong'));
    };

    return (
        <div className='w-auto h-auto bg-slate-50 py-4 px-3 rounded-lg'>
            <h1 className='text-2xl font-semibold my-3'>Todo App</h1>
            <div className='flex flex-row gap-1'>
                <input
                    className='bg-slate-50 outline-none border border-gray-400 p-2 w-72 rounded'
                    type="text"
                    value={newPost.content}
                    placeholder='Add your new todo'
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                <button
                    className='text-white text-2xl p-2 rounded bg-black hover:bg-gray-800 duration-150'
                    onClick={handleSubmit}
                >
                    <IoMdAdd />
                </button>
            </div>
            {validationMessage && (
                <p className='text-red-500 text-sm mt-2'>{validationMessage}</p>
            )}
            <div className='mt-3'>
                <ul>
                    {posts.map((item) => (
                        <li key={item.id} className="flex justify-between items-center border p-2 text-gray-700">
                            {item.content}
                            <div className="flex space-x-2">
                                <button aria-label="Edit" onClick={() => editPost(item)} className="text-white text-md p-2 rounded-full bg-black hover:bg-gray-800 duration-150">
                                    <MdEdit />
                                </button>
                                <button aria-label="Delete" onClick={() => deletePost(item.id)} className="text-white text-md p-2 rounded-full bg-black hover:bg-gray-800 duration-150">
                                    <MdDelete />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex justify-between items-center pt-4'>
                <p className='text-lg font-semibold'>You have {posts.length} pending tasks</p>
                <button onClick={clearAllPosts} className="text-white text-md p-2 rounded bg-black hover:bg-gray-800 duration-150">Clear All</button>
            </div>
        </div>
    );
}

export default Todoform;
