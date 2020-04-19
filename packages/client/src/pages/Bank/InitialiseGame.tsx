import React, { useState } from "react";
import { InputGroup, Button, Modal, Form } from "react-bootstrap";
import { IGameStatePlayer, GameEntity } from "@monopoly-money/game-state";
import { useModal } from "react-modal-hook";
import NumberFormat, { NumberFormatValues } from "react-number-format";

interface IInitialiseGameProps {
  players: IGameStatePlayer[];
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
}

const InitialiseGame: React.FC<IInitialiseGameProps> = ({ players, proposeTransaction }) => {
  const [showModal, hideModal] = useModal(() => (
    <ValueModal
      submitAmount={(amount: number) => {
        players.forEach((p) => {
          proposeTransaction("bank", p.playerId, amount);
        });
      }}
      onClose={hideModal}
    />
  ));

  return (
    <Button variant="primary" block onClick={showModal}>
      Initialise Player Balances
    </Button>
  );
};

interface IValueModalProps {
  submitAmount: (amount: number) => void;
  onClose: () => void;
}

const ValueModal: React.FC<IValueModalProps> = ({ submitAmount, onClose }) => {
  const [amount, setAmount] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = () => {
    if (amount === "") {
      setSubmitError("Please provide an amount");
    } else {
      setSubmitError(null);
      submitAmount(parseInt(amount, 10));
    }
  };

  const cancel = () => {
    setSubmitError(null);
    onClose();
  };

  return (
    <Modal show={true} onHide={cancel} size="lg" centered className="send-money-modal">
      <Modal.Header closeButton>
        <Modal.Title>Initialise Amount</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Once you give a player money or initialise balances, you can not initialise balances
          again.
        </p>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Amount</InputGroup.Text>
          </InputGroup.Prepend>
          <NumberFormat
            thousandSeparator={true}
            prefix="$"
            value={amount}
            onValueChange={({ value }: NumberFormatValues) => setAmount(value)}
            className="form-control"
          />
          <Button variant="success" className="remove-left-border-radius" onClick={submit}>
            Send
          </Button>
        </InputGroup>
        <Form.Text style={{ color: "var(--danger)" }}>{submitError}</Form.Text>
      </Modal.Body>
    </Modal>
  );
};

export default InitialiseGame;