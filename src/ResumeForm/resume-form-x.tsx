import React from "react";
import { Form } from "semantic-ui-react";
import { Formik, FormikProps } from "formik";

import "./resume-form.scss";
import {
  FormValues,
  initialFormValues,
  validationSchema,
  Section,
  toSection,
  sectionsList,
  lastSectionIndex
} from "./resume-form";
import { noOp } from "../utils";
import {
  PreviewBtn,
  PreviewBtnIcon,
  EditBtn,
  ToolTip,
  PrevBtnIcon,
  BottomNavs,
  NextBtn,
  NextBtnIcon
} from "./resume-form-styles";
import Preview from "./Preview";
import PersonalInfo from "./PersonalInfo";
import Experiences from "./Experiences";
import Education from "./Education";
import AdditionalSkills from "./AdditionalSkills";
import Languages from "./Languages";

enum Action {
  editing = "editing",
  previewing = "previewing"
}

interface State {
  action: Action;
  section: Section;
}

interface Props {
  initialValues?: FormValues;
}

export class ResumeForm extends React.Component<Props, State> {
  state: State = {
    action: Action.editing,
    section: Section.personalInfo
  };

  render() {
    return (
      <div className="ResumeForm">
        <Formik
          initialValues={this.props.initialValues || initialFormValues}
          onSubmit={noOp}
          render={this.renderForm}
          validationSchema={validationSchema}
          validateOnChange={false}
        />
      </div>
    );
  }

  private renderCurrEditingSection = (values: FormValues) => {
    const { action, section } = this.state;

    if (action !== Action.editing) {
      return null;
    }

    if (section === Section.personalInfo) {
      return <PersonalInfo values={values.personalInfo} label={section} />;
    }

    if (section === Section.experiences) {
      return <Experiences values={values.experiences} label={section} />;
    }

    if (section === Section.education) {
      return <Education label={section} />;
    }

    if (section === Section.addSkills) {
      return <AdditionalSkills label={section} />;
    }

    if (section === Section.langs) {
      return <Languages label={section} />;
    }

    return null;
  };

  private renderForm = ({ values, ...props }: FormikProps<FormValues>) => {
    const { action, section } = this.state;
    const sectionIndex = sectionsList.indexOf(section);

    return (
      <Form>
        {this.renderCurrEditingSection(values)}

        {action === Action.previewing && <Preview values={values} />}
        <BottomNavs>
          {action === Action.editing && (
            <>
              <PreviewBtn
                onClick={() => {
                  this.setState({ action: Action.previewing });
                }}
              >
                <ToolTip>Preview your resume</ToolTip>

                <PreviewBtnIcon />

                <span>Preview</span>
              </PreviewBtn>

              {sectionIndex > 0 && (
                <EditBtn
                  onClick={() =>
                    this.setState({ section: toSection(section, "prev") })
                  }
                >
                  <ToolTip>
                    {`Previous resume section ${toSection(
                      section,
                      "prev"
                    ).toLowerCase()}`}
                  </ToolTip>

                  <PrevBtnIcon />

                  <span>Previous</span>
                </EditBtn>
              )}

              {sectionIndex < lastSectionIndex && (
                <NextBtn
                  onClick={() =>
                    this.setState({ section: toSection(section, "next") })
                  }
                >
                  <ToolTip>
                    {`Next resume section ${toSection(
                      section,
                      "next"
                    ).toLowerCase()}`}
                  </ToolTip>

                  <span>Next</span>

                  <NextBtnIcon />
                </NextBtn>
              )}
            </>
          )}

          {action === Action.previewing && (
            <EditBtn onClick={() => this.setState({ action: Action.editing })}>
              <ToolTip>Show resume editor</ToolTip>

              <PrevBtnIcon />

              <span>Back to Editor</span>
            </EditBtn>
          )}
        </BottomNavs>
      </Form>
    );
  };
}

export default ResumeForm;
