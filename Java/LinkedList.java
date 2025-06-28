public class LinkedList {
    static class Node {
        int data;

        Node next;
        Node(int d) { data = d; next = null; }
    }

    Node head;
    public void append(int data) {
        Node newNode = new Node(data);
        if (head == null) { head = newNode; return; }
        Node last = head;
        while (last.next != null) last = last.next;
        last.next = newNode;
    }

    public void printList() {
        Node curr = head;
        while (curr != null) {
            System.out.print(curr.data + " -> ");
            curr = curr.next;

        }
        System.out.println("null");
    }

    public static void main(String[] args) {
        LinkedList ll = new LinkedList();
        ll.append(1); ll.append(2); ll.append(3);
        ll.printList();
    }
}
