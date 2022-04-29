import { Modal } from "react-responsive-modal";

type Props = {
  headline:string;
  body:JSX.Element;
  open:boolean;
  setOpen:Function;
  customClass:string;
};
export default function Manage({
  headline,
  body,
  open,
  setOpen,
  customClass,
}: Props) {
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
          <h2 style={{marginTop:0}}>{headline}</h2>
          <div className={customClass}>{body}</div>
        </div>
      </Modal>
    );
  else return null;
}
