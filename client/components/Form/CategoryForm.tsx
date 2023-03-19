import React from "react";
import { Action } from "../../features/auth/types";

type Props = {
  handleSubmit: (e: React.SyntheticEvent) => void;
  value: string;
  setValue: (name: string) => void;
  action: Action;
};

const CategoryForm = ({
  handleSubmit,
  value,
  setValue,
  action = Action.Create,
}: Props) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <p className="fs-3">
            {action === Action.Create ? "Add New" : "Update"}
          </p>
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
