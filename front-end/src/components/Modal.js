import { Modal } from "react-responsive-modal";

export default function Manage({ headline, body, open, setOpen, customClass }) {
  if (open)
    return (
      <Modal
        open={open}
        onClose={() => setOpen(null)}
        center
        // closeOnEsc={false}
        // closeOnOverlayClick={false}
        classNames={{
          // overlay: 'customOverlay',
          modal: "customModal",
        }}
      >
        <div>
          <h2>{headline}</h2>
          <div className={customClass}>{body}</div>
        </div>
      </Modal>
    );
  else return null;
}
