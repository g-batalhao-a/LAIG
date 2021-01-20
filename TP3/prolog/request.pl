

valid_moves(GameState, Player,ListOfMoves,TransBoard) :-
    transfromBoard(GameState,[],TransBoard,1),
    nth0(0, TransBoard, Row),
    length(Row, NumCols),
    length(TransBoard,NumRows),
    iterateMatrix(TransBoard, NumRows, NumCols, Player,ListOfMoves).

checkAvailableMoves(GameState,Done):-
    valid_moves(GameState, 'BLACKS',BlackMoves,_),
    valid_moves(GameState, 'WHITES',WhiteMoves,_),
    exclude(empty, BlackMoves, ResultBlacks),
    exclude(empty, WhiteMoves, ResultWhites),
    (
        ( \+ length(ResultBlacks, 0), Done=0)
        ;
        ( \+ length(ResultWhites, 0), Done=0)
        ;
        (Done=1)
        
    ).

game_over(GameState,Winner) :-
    write('Game Over!\n'),
    transfromBoard(GameState,[],TransBoard,1),
    checkWinner(TransBoard,Winner).

selectPiece(GameState,PieceAndMove,SelColumn,SelRow,ChosenPiece) :-
    length(PieceAndMove, LengthMove),
    validateContent(SelColumn, SelRow, GameState, FinalMoveGameState,PieceAndMove,0,LengthMove,ChosenPiece).

movePiece(GameState,FinalMoveGameState,PieceAndMove,ChosenPiece,MoveColumn,MoveRow) :-
    nth0(ChosenPiece,PieceAndMove,CMove),
    length(CMove, LengthMove),
    validateCapture(MoveRow, MoveColumn, GameState, FGS,PieceAndMove,1,LengthMove,ChosenPiece),
    (
        (
           FGS\='"invalid"',
            transfromBoard(FGS,[],FinalMoveGameState,0)
        );
        (
            FinalMoveGameState=FGS
        )
    ).

choose_move(GameState,PieceAndMove,Player,1,Reply):-
    getRandomPiece(PieceAndMove,SelIndex,SelectedPiece,GoToMove),
    getRandomPiece(GoToMove,MoveIndex,MovingTo),
    SelectedPiece=[SelCol,SelRow],
    MovingTo=[MoveCol,MoveRow],
    Move=[SelCol,SelRow,MoveCol,MoveRow],
    nth0(SelIndex,PieceAndMove,MoveSet),
    length(MoveSet,LengthMove),
    validateCapture(MoveRow,MoveCol,GameState,FinalGameState,PieceAndMove,MoveIndex,LengthMove,SelIndex),
    transfromBoard(FinalGameState,[],FGS,0),
    Reply = FGS/Move.

choose_move(GameState,PieceAndMove,Player,2,Reply):-
    value(GameState,PieceAndMove,Player,ValuesList),
    nth0(0,ValuesList,BestMove),
    BestMove=_-[SelCol,SelRow]-[MoveCol,MoveRow]-SelIndex-MoveIndex,
    Move=[SelCol,SelRow,MoveCol,MoveRow],
    nth0(SelIndex,PieceAndMove,MoveSet),
    length(MoveSet,LengthMove),
    validateCapture(MoveRow,MoveCol,GameState,FinalGameState,PieceAndMove,MoveIndex,LengthMove,SelIndex),
    transfromBoard(FinalGameState,[],FGS,0),
    Reply = FGS/Move.

initialBoard(GameBoard,1):-
    %GameBoard = [[[0,2],[-1],[1],[-1],[-1],[-1]],[[-1],[-1],[-1],[-1],[-1],[-1]],[[-1],[-1],[-1],[-1],[-1],[-1]],[[-1],[-1],[-1],[-1],[-1],[-1]],[[-1],[-1],[-1],[-1],[-1],[-1]],[[-1],[1,2,1],[-1],[-1],[-1],[-1]]].
    generate36Board(GB),
    transfromBoard(GB,[],GameBoard,0).

initialBoard(GameBoard,2):-
    generate54Board(GB),
    transfromBoard(GB,[],GameBoard,0).
initialBoard(GameBoard,3):-
    generate81Board(GB),
    transfromBoard(GB,[],GameBoard,0).


replace(empty,-1).
replace(black,0).
replace(white,1).
replace(green,2).

transformRow([],TRow,TRow,_).
transformRow([Cell|R],Acc,TRow,0):-
    findall(E,(member(X, Cell),replace(X,E)),TransCell),
    append(Acc,[TransCell],NAcc),
    transformRow(R,NAcc,TRow,0).

transformRow([Cell|R],Acc,TRow,1):-
    findall(E,(member(X, Cell),replace(E,X)),TransCell),
    append(Acc,[TransCell],NAcc),
    transformRow(R,NAcc,TRow,1).
    
transfromBoard([],TransBoard,TransBoard,_).
transfromBoard([R|Rest],Acc,TransBoard,Type):-
    findall(TransRow,transformRow(R,[],TransRow,Type),TR),
    append(Acc,TR,NAcc),
    transfromBoard(Rest,NAcc,TransBoard,Type).