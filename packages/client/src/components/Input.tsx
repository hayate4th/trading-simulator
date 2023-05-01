import styled from "styled-components";

import { Variables } from "../App";

type Props = {
  varableTypeText: string;
  variableType: keyof Variables;
  variables: Variables;
  setVariables: (variables: Variables) => void;
};

const Component: React.FC<Props & PropsForStyled> = ({
  className,
  varableTypeText,
  variableType,
  variables,
  setVariables,
}) => {
  return (
    <div className={className}>
      <label htmlFor={variableType}>{varableTypeText}</label>
      <input
        type="number"
        name={variableType}
        onChange={(event) =>
          setVariables({
            ...variables,
            [variableType]: event.target.valueAsNumber,
          })
        }
        value={variables[variableType]}
      />
    </div>
  );
};

const StyledComponent: React.FC<Props> = styled(Component)`
  position: relative;

  label {
    position: absolute;
    top: 0;
    left: 15px;
    padding: 0 2px;
    font-size: 15px;
    color: #fff;
    pointer-events: none;
    background: #242424;
    transform: translateY(-50%);
  }

  input {
    width: calc(500px - 30px + 10px);
    height: 50px;
    padding: 0 15px;
    margin-bottom: 15px;
    font-size: 19px;
    background: transparent;
    border: 3px solid #a9ffdc;
    border-radius: 5px;
    outline: none;

    &:focus {
      border: 3px solid #e555c7;
    }
  }
`;

const Container: React.FC<Props> = ({
  varableTypeText,
  variableType,
  variables,
  setVariables,
}) => {
  return (
    <StyledComponent
      varableTypeText={varableTypeText}
      variableType={variableType}
      variables={variables}
      setVariables={setVariables}
    />
  );
};
export const Input = Container;
