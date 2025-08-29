
import  { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCvByUserId } from '@/store/cvSlice';
import Loader from '@/components/Loader';

// eslint-disable-next-line react/prop-types
const CvDisplayComponent = ({ userId }) => {
  const dispatch = useDispatch();
  const { cvUrl, loading, error } = useSelector((state) => state.cv);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCvByUserId(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {cvUrl ? (
        <iframe src={cvUrl} width="100%" height="600px" title="User CV"></iframe>
      ) : (
        <div>No CV available</div>
      )}
    </div>
  );
};

export default CvDisplayComponent;
