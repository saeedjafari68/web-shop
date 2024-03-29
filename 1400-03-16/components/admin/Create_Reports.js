import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Multiselect } from 'multiselect-react-dropdown';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { confirmAlert } from 'react-confirm-alert';

import { connect } from 'react-redux';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';

class Create_Reports extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.FilterRef = React.createRef();

    this.CreateForm = this.CreateForm.bind(this);
    this.onHideFormsDialog = this.onHideFormsDialog.bind(this);
    this.SetReports = this.SetReports.bind(this);
    this.state = {
      layout: 'list',
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: ""

    }


  }
  componentDidMount() {
    let param = {
      token: localStorage.getItem("api_token"),
    };
    this.setState({
      loading: 1
    })
    let that = this;
    let SCallBack = function (response) {
      that.setState({
        user_Id: response.data.authData.userId,
        loading: 0
      })

      that.GetReports();

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  SetReports() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      _id: this.state.selectedId,
      name: this.state.name,
      number: this.state.number,
      Filters : this.FilterRef.current.getSelectedItems(),
      method:this.state.method
    };
    this.setState({
      loading: 1
    })
    this.setState({
      HasErrorForMaps: null
    })
    let SCallBack = function (response) {
      that.onHideFormsDialog();
      that.GetReports();
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      console.log(error)
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/SetReports", param, SCallBack, ECallBack)
  }
  CreateForm() {
    this.setState({
      visibleManageFilter: true,
      name: "",
      type: "1",
      FId: "",
      DbTableName: "",
      DBTableField: "",
      OutputField: "",
      selectedId: null,
      method:""
    })

  }
  onHideFormsDialog(event) {
    this.setState({
      visibleManageFilter: false,
      selectedId: null
    });

  }
  onHideMapsDialog(event) {
    this.setState({
      visibleManageMaps: false,
      HasErrorForMaps: null
    });

  }
  selectedComponentChange(value) {
    let that = this;
    var p = [];
    this.setState({
      name: value.name,
      number: value.number,
      selectedId: value._id,
      FilterSelected:value.Filters,
      visibleManageFilter: true,
      method:value.method
    })

  }
  GetReports() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      GetAll: 1
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.GetFilters();
      that.setState({
        GridDataFilters: response.data.result
      })
      that.setState({
        loading: 0
      })
    };
    let ECallBack = function (error) {
      that.GetFilters();
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetReports", param, SCallBack, ECallBack)
  }
  delFilter(rowData) {

    this.setState({
      visibleManageFilter:false
    })
    confirmAlert({
      title: <span className="yekan">حذف کاربر</span>,
      message: <span className="yekan">  آیا از حذف  {rowData.name} مطمئنید  </span>,
      buttons: [
        {
          label: <span className="yekan">بله </span>,
          onClick: () => {
            let that = this;
            let param = {
              token: localStorage.getItem("api_token"),
              _id: rowData._id,
              del:1
            };
            let SCallBack = function (response) {
              that.setState({
                loading: 0
              })
              that.GetReports();
              Alert.success('عملیات با موفقیت انجام شد', 5000);
            };
            let ECallBack = function (error) {
              that.setState({
                loading: 0
              })
              Alert.error('عملیات انجام نشد', 5000);
            }
            this.Server.send("AdminApi/SetReports", param, SCallBack, ECallBack)

          }
        },
        {
          label: <span className="yekan">خیر </span>
        }
      ]
    });

  }
  GetFilters() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    this.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        FilterList: response.data.result
      })
      let FilterList = [];
      for (let i = 0; i < that.state.FilterList.length; i++) {
        FilterList.push({ name: that.state.FilterList[i].name, id: that.state.FilterList[i]._id })
      }
      that.setState({
        FilterListForDropDown: FilterList,
        loading: 0
      })

    };
    let ECallBack = function (error) {
      Alert.error('عملیات انجام نشد', 5000);
      that.setState({
        loading: 0
      })
    }
    this.Server.send("AdminApi/GetFilters", {}, SCallBack, ECallBack)



  }
  
  render() {
    const footer = (
      <div>
        <button className="btn btn-primary irsans" onClick={this.SetReports} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}> اعمال </button>

      </div>
    );

    const delTemplate = (rowData, props) => {
      return <i className="fa fa-times" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.delFilter(rowData)}></i>;
    }
    return (

      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            <div className="row" >
              <div className="col-6" style={{ textAlign: 'center' }}>
                <button className="btn btn-primary irsans" onClick={this.CreateForm} style={{ width: "200px", marginTop: "20px", marginBottom: "20px" }}>ساخت گزارش جدید</button>
              </div>

            </div>
            <div className="section-title " style={{ textAlign: 'right' }}><span className="title IRANYekan" style={{ fontSize: 17, color: 'gray' }} >لیست گزارشات</span></div>

            <DataTable responsive value={this.state.GridDataFilters} selectionMode="single" selection={this.state.selectedComponent} onSelectionChange={e => this.selectedComponentChange(e.value)}>
              <Column field="number" header="شماره گزارش" className="irsans" style={{ textAlign: "center" }} />
              <Column field="name" header="نام" className="irsans" style={{ textAlign: "center" }} />
              <Column field="del" body={delTemplate} header="حذف" className="irsans" style={{ textAlign: "center" }} />
            </DataTable>
          </div>

        </div>


        <Dialog header={this.state.selectedId ? "اصلاح" : "ساخت گزارش جدید"} visible={this.state.visibleManageFilter} footer={footer} onHide={this.onHideFormsDialog} maximizable={false} maximized={true}>
          <form>

            <div className="row">
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.number} name="number" onChange={(event) => this.setState({ number: event.target.value })} required="true" />
                  <label>شماره گزارش</label>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.method} name="method" onChange={(event) => this.setState({ method: event.target.value })} required="true" />
                  <label>نام متد</label>
                </div>
              </div>
              
              <div className="col-lg-12">

                <div className="group">
                  <input className="form-control irsans" autoComplete="off" type="text" value={this.state.name} name="name" onChange={(event) => this.setState({ name: event.target.value })} required="true" />
                  <label >عنوان</label>

                </div>
              </div>
              <div className="col-lg-6">
                <div className="group">
                <Multiselect
                      placeholder="فیلتر ها"
                      ref={this.FilterRef}
                      options={this.state.FilterListForDropDown} // Options to display in the dropdown
                      selectedValues={this.state.FilterSelected} // Preselected value to persist in dropdown
                      displayValue="name" // Property name to display in the dropdown options

                    />
                 </div>
              </div>



            </div>
          </form>
        </Dialog>

      </div>





    )
  }
}
const mapStateToProps = (state) => {
  return {
    username: state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(Create_Reports)
);
