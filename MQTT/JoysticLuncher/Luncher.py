from PyQt5.QtWidgets import (
    QApplication, QWidget, QPushButton, QLabel, QLineEdit,
    QHBoxLayout, QVBoxLayout, QGridLayout, QSpacerItem, QSizePolicy
)
from PyQt5.QtCore import Qt


class ControlUI(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Joystick + Video UI")
        self.setFixedWidth(800)

        main_layout = QHBoxLayout()
        main_layout.setAlignment(Qt.AlignCenter)

        # -----------------------------------
        # 1) Left joystick control layout
        # -----------------------------------
        left_layout = QGridLayout()

        btn_up = QPushButton("↑")
        btn_down = QPushButton("↓")
        btn_left = QPushButton("←")
        btn_right = QPushButton("→")
        btn_center = QPushButton("●")

        for b in [btn_up, btn_down, btn_left, btn_right, btn_center]:
            b.setFixedSize(60, 60)

        left_layout.addItem(QSpacerItem(0, 20, QSizePolicy.Minimum, QSizePolicy.Expanding), 0, 1)
        left_layout.addWidget(btn_up, 1, 1)
        left_layout.addWidget(btn_left, 2, 0)
        left_layout.addWidget(btn_center, 2, 1)
        left_layout.addWidget(btn_right, 2, 2)
        left_layout.addWidget(btn_down, 3, 1)
        left_layout.addItem(QSpacerItem(0, 20, QSizePolicy.Minimum, QSizePolicy.Expanding), 4, 1)

        # -----------------------------------
        # 2) Right video + text form layout
        # -----------------------------------
        right_layout = QVBoxLayout()
        right_layout.setAlignment(Qt.AlignTop)

        # 비디오 이미지 라벨
        self.video_label = QLabel("이미지 창(비디오)")
        self.video_label.setFixedSize(400, 300)
        self.video_label.setStyleSheet("border: 2px solid black; background-color: #eeeeee;")
        self.video_label.setAlignment(Qt.AlignCenter)

        # 텍스트 입력 + 버튼
        form_layout = QHBoxLayout()
        self.text_input = QLineEdit()
        send_btn = QPushButton("보내기")
        self.text_input.setFixedHeight(35)
        send_btn.setFixedHeight(35)

        form_layout.addWidget(self.text_input)
        form_layout.addWidget(send_btn)

        # ⬅️ form_layout 전체를 400폭으로 고정
        form_widget = QWidget()
        form_widget.setFixedWidth(400)
        form_widget.setLayout(form_layout)

        # 오른쪽 최종 배치
        right_layout.addWidget(self.video_label)
        right_layout.addSpacing(10)
        right_layout.addWidget(form_widget)

        # 전체 레이아웃 병합
        main_layout.addLayout(left_layout)
        main_layout.addSpacing(40)
        main_layout.addLayout(right_layout)

        # 일단 모르겠고 하드코딩함
        btn_up.clicked.connect(lambda: self.btn_clicked(1))
        btn_down.clicked.connect(lambda: self.btn_clicked(2))
        btn_left.clicked.connect(lambda: self.btn_clicked(3))
        btn_right.clicked.connect(lambda: self.btn_clicked(4))
        # 아래꺼는 5가 나와버리네
        # number = 1
        # for b in [btn_up, btn_down, btn_left, btn_right]:
        #     number += 1

        send_btn.clicked.connect(self.cmd_clicked)
        self.setLayout(main_layout)


    # 버튼 이벤트
    def btn_clicked(self, dir):
        print(f"방향 : {dir}")


    # 버튼 이벤트
    def cmd_clicked(self):
        print(f"cmd : {self.get_cmd()}")
        self.text_input.setText("")


    # 이미지 띄우기
    def set_image(self, img):
        print("이미지 띄우기")


    # 임시커맨드 전달
    def get_cmd(self):
        return self.text_input.text()


if __name__ == "__main__":
    app = QApplication([])
    ui = ControlUI()
    ui.show()
    app.exec()
