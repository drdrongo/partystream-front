import { IMAGE_SIZES } from "../enums/imageSizes";
import { bytesToSize } from "../utils/files";

interface Props {
  isModalOpen: boolean;
  sizes: number[];
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
const SizesModal = ({ isModalOpen, sizes, handleClick }: Props) => {
  return (
    <>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li>
                <button value={IMAGE_SIZES.SMALL} onClick={handleClick}>
                  Small ({bytesToSize(sizes[0])})
                </button>
              </li>
              <li>
                <button value={IMAGE_SIZES.MEDIUM} onClick={handleClick}>
                  Medium ({bytesToSize(sizes[1])})
                </button>
              </li>
              <li>
                <button value={IMAGE_SIZES.LARGE} onClick={handleClick}>
                  Large ({bytesToSize(sizes[2])})
                </button>
              </li>
              <li>
                <button value={IMAGE_SIZES.ORIGINAL} onClick={handleClick}>
                  Original ({bytesToSize(sizes[3])})
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default SizesModal;
