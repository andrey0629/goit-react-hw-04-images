import { useReducer, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { fetchImg } from '../api/fetch';
import { createPortal } from 'react-dom';
const modalRoot = document.querySelector('#modal-root');
const initialState = {
  request: '',
  page: 1,
  response: [],
  isLimitPage: false,
  largeImg: null,
  status: 'idle',
};
const reducer = (state, action) => {
  switch (action.type) {
    case 'request':
      return { ...state, request: action.payload };
    case 'page':
      return { ...state, page: action.payload };
    case 'response':
      return { ...state, response: [...state.response, ...action.payload] };
    case 'isLimitPage':
      return { ...state, isLimitPage: action.payload };
    case 'largeImg':
      return { ...state, largeImg: action.payload };
    case 'status':
      return { ...state, status: action.payload };
    case 'resetResponse':
      return { ...state, response: initialState.response };

    default:
      throw Error('Unknown action: ' + action.type);
  }
};

export function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { request, page, response, isLimitPage, largeImg, status } = state;

  useEffect(() => {
    if (request === '') {
      return;
    }
    async function fetch() {
      try {
        dispatch({ type: 'status', payload: 'pending' });
        const { dataImg, totalHits } = await fetchImg(request, page);
        dispatch({ type: 'response', payload: dataImg });
        dispatch({ type: 'status', payload: 'resolved' });
        limitPage(totalHits);
      } catch (error) {
        console.error();
      } finally {
        dispatch({ type: 'status', payload: 'idle' });
      }
    }
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, page]);

  const handleSubmit = ({ inputValue }) => {
    if (inputValue.trim() === '') {
      return;
    }
    dispatch({ type: 'request', payload: inputValue });
    dispatch({ type: 'resetResponse' });
    dispatch({ type: 'page', payload: 1 });
  };

  const handleNextPage = () => {
    dispatch({ type: 'page', payload: page + 1 });
  };

  function limitPage(totalHits) {
    const limitPage = page < Math.ceil(totalHits / 12);
    dispatch({ type: 'isLimitPage', payload: limitPage });
  }
  const openLargeImage = largeImageURL => {
    dispatch({ type: 'largeImg', payload: largeImageURL });
  };
  const closeModal = () => {
    dispatch({ type: 'largeImg', payload: null });
  };

  return (
    <>
      <div className="App">
        <Searchbar request={handleSubmit} />
        <ImageGallery
          status={status}
          response={response}
          onClick={openLargeImage}
        />
        {status === 'pending' && <Loader />}

        {status === 'pending'
          ? null
          : response.length !== 0 &&
            isLimitPage && <Button onClick={handleNextPage} />}
      </div>
      {largeImg &&
        createPortal(
          <Modal largeImg={largeImg} onClose={closeModal} />,
          modalRoot
        )}
      <ToastContainer />
    </>
  );
}
