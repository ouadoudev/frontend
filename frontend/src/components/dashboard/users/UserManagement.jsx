import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, deleteUser } from '@/store/userSlice';
import { Dialog } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector(state => state.user);
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState(null);

  const handleOpen = (user) => {
    setUserId(user._id);
    setUserData({ username: user.username, email: user.email }); 
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    dispatch(updateUser({ userId, userData }));
    handleClose();
  };

  const handleDeleteUser = (userId) => {
    dispatch(deleteUser(userId));
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleOpen(user)}>Update</button>
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={open} onClose={handleClose}>
        <div>
          <h2>Update User</h2>
          <Label
            label="Username"
            name="username"
            value={userData.username} 
            onChange={handleChange}
          />
          <Label
            label="Email"
            name="email"
            value={userData.email} 
            onChange={handleChange}
          />
          <Button onClick={handleUpdate}>Update</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default UserManagement;
