import { Tcas } from '../Tcas';

export class TcasRound {
   public static allTcasRound: Tcas[] = [
        {
            round: '1',
            description: 'Portfolio',
            examReference: [
                'แฟ้มสะสมงาน หรือ portfolio',
                'เกรดเฉลี่ยสะสม (4-5 ภาคเรียน)',
                'คุณสมบัติพิเศษ ของแต่คณะ / สาขาวิชาและมหาวิทยาลัย'
            ]
        },
        {
            round: '2',
            description: 'การรับแบบโควตา',
            examReference: [
                'เกรดเฉลี่ยสะสม',
                'GAT/PAT',
                '9 วิชาสามัญ',
                'คุณสมบัติพิเศษ (มีความแตกต่างกันออกไป ขึ้นอยู่กับแต่ละคณะ/สาขาวิชา)',
                'คะแนน O-NET ขั้นต่ำ (สำหรับบางโครงการ)'
            ]
        },
        {
            round: '3',
            description: 'รับตรงร่วมกัน (+กสพท)',
            examReference: [
                'เกรดเฉลี่ยขั้นต่ำ (สำหรับบางโครงการ)',
                'GAT/PAT',
                '9 วิชาสามัญ',
                'สอบวิชาเฉพาะ',
                'คะแนน O-NET ขั้นต่ำ (สำหรับบางโครงการ + กสพท)'
            ]
        },
        {
            round: '4',
            description: 'การรับแบบแอดมิชชัน',
            examReference: [
                'เกรดเฉลี่ยสะสม',
                'O-NET',
                'GAT/PAT'
            ]
        },
        {
            round: '5',
            description: 'การรับตรงอิสระ',
            examReference: [
                'เกรดเฉลี่ยขั้นต่ำ (สำหรับบางโครงการ)',
                'O-NET',
                'GAT/PAT',
                '9 วิชาสามัญ'
            ]
        }
    ];
}