import React from "react";
import PluginComponent from "./plugin-component";
import { shallow } from "enzyme";

const expectedText =  "LARA Context";

const props = {
  helloText: "Hello World!"
};

describe("WindowShade component", () => {
  it("renders Hello World", () => {
    const wrapper = shallow(<PluginComponent authoredState={props}/>);
    expect(wrapper.text()).toMatch(expectedText);
  });
});
