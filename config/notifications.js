import React from "react";
// import { notification, message as AntMessages, Row, Col, Button } from "antd";
// import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { Alert } from "react-native"
import { showMessage } from "react-native-flash-message";
import store from "../redux";
import { getTranslation } from "../labels";
import { confirmAction, setCurrentObjectPath } from "../redux/actions";




export const showNotification = ({
  message,
  description,
  duration,
  type = "info",
  placement = store.getState().general.isRTL ? "topLeft" : "topRight",
  bottom,
  top,
  btn,
  className,
  closeIcon,
  getContainer,
  icon,
  key,
  onClick,
  onClose,
  prefixCls,
  style,
}) => {
  console.log("message")
  console.log(description)
  console.log(description.split(" ").length) 
  console.log("duration")
  if(!duration)
    duration = 2000+((description.split(" ").length/3)*1000);
  
  console.log(duration)
  
  showMessage({
    message,
    description,
    type,
    position:placement,
    duration, 
    onPress:onClick,

  });

//   notification[type]({
//     placement,
//     message,
//     description,
//     duration,
//     type,
//     bottom,
//     top,
//     btn,
//     className,
//     closeIcon,
//     getContainer,
//     icon,
//     key,
//     onClick,
//     onClose,
//     prefixCls,
//     style,
//   });
};

export const showWarning = ({ objectPk, title, message }, tdlId, usecaseId) => {

  Alert.alert(
    title,
    message,
    [
      { text: getTranslation("confirm"), onPress: () => {
                      if (objectPk) {
                        store.dispatch(setCurrentObjectPath(usecaseId, objectPk));
                      }
                      store.dispatch(confirmAction(usecaseId, tdlId));
                      // AntMessages.destroy(key);
                    } }
    ],
    { cancelable: true }
  );

//   const key = `${objectPk}${tdlId}`;
//   AntMessages.warn({
//     duration: 0,
//     key,
//     content: (
//       <Row gutter={[8, 8]}>
//         <Col span={24}>{title}</Col>
//         <Col span={24}>{message}</Col>
//         <Col span={12}>
//           <Button
//             onClick={() => {
//               if (objectPk) {
//                 store.dispatch(setCurrentObjectPath(usecaseId, objectPk));
//               }
//               store.dispatch(confirmAction(usecaseId, tdlId));
//               AntMessages.destroy(key);
//             }}
//             icon={<CheckOutlined />}
//           >
//             {getTranslation("confirm")}
//           </Button>
//         </Col>
//         <Col span={12}>
//           <Button
//             onClick={() => {
//               AntMessages.destroy(key);
//             }}
//             icon={<CloseOutlined />}
//           >
//             {getTranslation("cancel")}
//           </Button>
//         </Col>
//       </Row>
//     ),
//   });
};
